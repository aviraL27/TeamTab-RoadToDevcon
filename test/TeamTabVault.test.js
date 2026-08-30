const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TeamTabVault - Account Abstraction & Scoped Spending Keys", function () {
  let TeamTabVault;
  let vault;
  let owner, lead, hackerSam, hackerMaya, merchant, relayer;
  let eventEndTime;

  const INITIAL_POT = ethers.parseEther("5.0"); // 5 ETH initial pot

  beforeEach(async function () {
    [owner, lead, hackerSam, hackerMaya, merchant, relayer] = await ethers.getSigners();

    const latestBlock = await ethers.provider.getBlock("latest");
    eventEndTime = latestBlock.timestamp + 3 * 24 * 3600; // 3 days (Hackathon duration)

    TeamTabVault = await ethers.getContractFactory("TeamTabVault");
    vault = await TeamTabVault.connect(lead).deploy(
      lead.address,
      "CyberPulse AI",
      "ETHIndia 2024",
      eventEndTime,
      { value: INITIAL_POT }
    );
    await vault.waitForDeployment();
  });

  describe("1. Vault Initialization & Funding", function () {
    it("Should correctly initialize vault state and balance", async function () {
      expect(await vault.teamLead()).to.equal(lead.address);
      expect(await vault.teamName()).to.equal("CyberPulse AI");
      expect(await vault.hackathonEvent()).to.equal("ETHIndia 2024");
      expect(await vault.totalDeposited()).to.equal(INITIAL_POT);
      expect(await ethers.provider.getBalance(await vault.getAddress())).to.equal(INITIAL_POT);
    });

    it("Should allow adding more funds to the tab", async function () {
      const topUp = ethers.parseEther("1.5");
      await vault.connect(lead).fundTab({ value: topUp });
      expect(await vault.totalDeposited()).to.equal(INITIAL_POT + topUp);
    });
  });

  describe("2. Scoped Session Key Issuance", function () {
    it("Should allow Team Lead to issue scoped session keys to members", async function () {
      const ceiling = ethers.parseEther("0.5");
      const singleLimit = ethers.parseEther("0.2");
      const category = "API Credits";

      await vault.connect(lead).issueScopedKey(
        hackerSam.address,
        "Sam (AI Lead)",
        category,
        ceiling,
        singleLimit,
        eventEndTime
      );

      const key = await vault.scopedKeys(hackerSam.address);
      expect(key.member).to.equal(hackerSam.address);
      expect(key.memberName).to.equal("Sam (AI Lead)");
      expect(key.category).to.equal(category);
      expect(key.ceiling).to.equal(ceiling);
      expect(key.spent).to.equal(0);
      expect(key.singleTxLimit).to.equal(singleLimit);
      expect(key.active).to.be.true;
    });

    it("Should revert if a non-lead attempts to issue or revoke keys", async function () {
      await expect(
        vault.connect(hackerSam).issueScopedKey(
          hackerMaya.address,
          "Maya",
          "Hardware",
          ethers.parseEther("0.1"),
          ethers.parseEther("0.1"),
          eventEndTime
        )
      ).to.be.revertedWithCustomError(vault, "OnlyTeamLeadAllowed");
    });
  });

  describe("3. Scoped Spending Execution & Policy Enforcement", function () {
    beforeEach(async function () {
      // Issue key to Sam for API Credits (Ceiling: 0.5 ETH, Single limit: 0.2 ETH)
      await vault.connect(lead).issueScopedKey(
        hackerSam.address,
        "Sam (AI Lead)",
        "API Credits",
        ethers.parseEther("0.5"),
        ethers.parseEther("0.2"),
        eventEndTime
      );
    });

    it("Should allow authorized member to execute spend within limits", async function () {
      const spendAmount = ethers.parseEther("0.15");
      const merchantInitialBal = await ethers.provider.getBalance(merchant.address);

      const tx = await vault.connect(hackerSam).executeScopedSpend(
        merchant.address,
        spendAmount,
        "API Credits",
        "OpenAI GPT-4o API Batch Credits",
        "ipfs://QmReceiptSample123"
      );

      await expect(tx).to.emit(vault, "TaggedSpendExecuted");

      // Verify merchant received funds
      const merchantFinalBal = await ethers.provider.getBalance(merchant.address);
      expect(merchantFinalBal - merchantInitialBal).to.equal(spendAmount);

      // Verify key tracking
      const key = await vault.scopedKeys(hackerSam.address);
      expect(key.spent).to.equal(spendAmount);

      // Verify spend history audit trail
      const history = await vault.getSpendHistory();
      expect(history.length).to.equal(1);
      expect(history[0].memberName).to.equal("Sam (AI Lead)");
      expect(history[0].category).to.equal("API Credits");
      expect(history[0].purpose).to.equal("OpenAI GPT-4o API Batch Credits");
      expect(history[0].amount).to.equal(spendAmount);
    });

    it("Should REJECT spend exceeding single transaction limit", async function () {
      const excessiveAmount = ethers.parseEther("0.25"); // limit is 0.2
      await expect(
        vault.connect(hackerSam).executeScopedSpend(
          merchant.address,
          excessiveAmount,
          "API Credits",
          "Excessive cluster compute",
          "ipfs://receipt"
        )
      ).to.be.revertedWithCustomError(vault, "ExceedsSingleTxLimit");
    });

    it("Should REJECT spend on unauthorized category", async function () {
      const spendAmount = ethers.parseEther("0.1");
      await expect(
        vault.connect(hackerSam).executeScopedSpend(
          merchant.address,
          spendAmount,
          "Food & Drinks", // Sam only has API Credits permission
          "Pizza order",
          "ipfs://receipt"
        )
      ).to.be.revertedWithCustomError(vault, "CategoryMismatch");
    });

    it("Should REJECT spend exceeding cumulative ceiling", async function () {
      // First spend 0.2 ETH (ok)
      await vault.connect(hackerSam).executeScopedSpend(
        merchant.address,
        ethers.parseEther("0.2"),
        "API Credits",
        "Spend 1",
        "ipfs://r1"
      );

      // Second spend 0.2 ETH (ok) -> total 0.4 ETH
      await vault.connect(hackerSam).executeScopedSpend(
        merchant.address,
        ethers.parseEther("0.2"),
        "API Credits",
        "Spend 2",
        "ipfs://r2"
      );

      // Third spend 0.2 ETH -> exceeds ceiling of 0.5 ETH!
      await expect(
        vault.connect(hackerSam).executeScopedSpend(
          merchant.address,
          ethers.parseEther("0.2"),
          "API Credits",
          "Spend 3",
          "ipfs://r3"
        )
      ).to.be.revertedWithCustomError(vault, "ExceedsBudgetCeiling");
    });

    it("Should REJECT spend if key is expired", async function () {
      // Fast forward time past event end
      await ethers.provider.send("evm_increaseTime", [4 * 24 * 3600]);
      await ethers.provider.send("evm_mine");

      await expect(
        vault.connect(hackerSam).executeScopedSpend(
          merchant.address,
          ethers.parseEther("0.1"),
          "API Credits",
          "Expired spend",
          "ipfs://receipt"
        )
      ).to.be.revertedWithCustomError(vault, "EventAlreadyEnded");
    });
  });

  describe("4. Gasless Meta-Transactions / EIP-712 Paymaster Flow", function () {
    it("Should execute spend via relayer with member EIP-712 signature (0 gas paid by member)", async function () {
      // Issue key to Maya for Hardware (Ceiling: 1.0 ETH)
      await vault.connect(lead).issueScopedKey(
        hackerMaya.address,
        "Maya (Hardware)",
        "Hardware & IoT",
        ethers.parseEther("1.0"),
        ethers.parseEther("0.5"),
        eventEndTime
      );

      const chainId = (await ethers.provider.getNetwork()).chainId;
      const vaultAddress = await vault.getAddress();

      const domain = {
        name: "TeamTabVault",
        version: "1",
        chainId: chainId,
        verifyingContract: vaultAddress,
      };

      const types = {
        SpendAuthorization: [
          { name: "member", type: "address" },
          { name: "recipient", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "category", type: "string" },
          { name: "purpose", type: "string" },
          { name: "receiptHash", type: "string" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };

      const spendAmount = ethers.parseEther("0.35");
      const deadline = eventEndTime;
      const nonce = await vault.nonces(hackerMaya.address);

      const value = {
        member: hackerMaya.address,
        recipient: merchant.address,
        amount: spendAmount,
        category: "Hardware & IoT",
        purpose: "Arduino & LoRa Transceivers",
        receiptHash: "ipfs://QmHardwareReceipt999",
        nonce: nonce,
        deadline: deadline,
      };

      // Member signs the authorization off-chain
      const signature = await hackerMaya.signTypedData(domain, types, value);

      // Relayer / Paymaster broadcasts the transaction paying the gas
      const merchantPreBal = await ethers.provider.getBalance(merchant.address);

      await vault.connect(relayer).executeScopedSpendWithSignature(
        hackerMaya.address,
        merchant.address,
        spendAmount,
        "Hardware & IoT",
        "Arduino & LoRa Transceivers",
        "ipfs://QmHardwareReceipt999",
        deadline,
        signature
      );

      const merchantPostBal = await ethers.provider.getBalance(merchant.address);
      expect(merchantPostBal - merchantPreBal).to.equal(spendAmount);

      const key = await vault.scopedKeys(hackerMaya.address);
      expect(key.spent).to.equal(spendAmount);
    });
  });

  describe("5. Post-Event Sweeping", function () {
    it("Should allow team lead to sweep unspent pot after event", async function () {
      const leadPreBal = await ethers.provider.getBalance(lead.address);
      const vaultBalance = await ethers.provider.getBalance(await vault.getAddress());

      const tx = await vault.connect(lead).sweepRemainingFunds(lead.address, "Event Concluded");
      const receipt = await tx.wait();
      const gasCost = receipt.gasUsed * receipt.gasPrice;

      const leadPostBal = await ethers.provider.getBalance(lead.address);
      expect(leadPostBal).to.be.closeTo(leadPreBal + vaultBalance - gasCost, ethers.parseEther("0.001"));
      expect(await ethers.provider.getBalance(await vault.getAddress())).to.equal(0);
    });
  });
});
