const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("==================================================");
  console.log("  TEAMTAB DEPLOYMENT - ROAD TO DEVCON IIITN");
  console.log("==================================================");
  console.log("Deployer Address:", deployer.address);
  console.log("Deployer Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH");

  // 1. Deploy Factory
  const TeamTabFactory = await hre.ethers.getContractFactory("TeamTabFactory");
  const factory = await TeamTabFactory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("\n[+] TeamTabFactory deployed to:", factoryAddress);

  // 2. Deploy a Sample Demo Vault: "CyberPulse AI - ETHIndia 2024"
  const eventDuration = 3 * 24 * 3600; // 3 days
  const latestBlock = await hre.ethers.provider.getBlock("latest");
  const eventEndTime = latestBlock.timestamp + eventDuration;
  const initialDeposit = hre.ethers.parseEther("1.0");

  const TeamTabVault = await hre.ethers.getContractFactory("TeamTabVault");
  const vault = await TeamTabVault.deploy(
    deployer.address,
    "CyberPulse AI",
    "ETHIndia 2024",
    eventEndTime,
    { value: initialDeposit }
  );
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("[+] Demo TeamTabVault deployed to:", vaultAddress);

  console.log("\n--- Vault Details ---");
  console.log("Team Lead:", deployer.address);
  console.log("Event:", "ETHIndia 2024");
  console.log("Initial Pot:", "1.0 ETH");
  console.log("Event End Time:", new Date(eventEndTime * 1000).toUTCString());

  console.log("\nUpdate your .env or src/lib/contracts.ts with:");
  console.log(`NEXT_PUBLIC_VAULT_FACTORY_ADDRESS="${factoryAddress}"`);
  console.log(`NEXT_PUBLIC_DEMO_VAULT_ADDRESS="${vaultAddress}"`);
  console.log("==================================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
