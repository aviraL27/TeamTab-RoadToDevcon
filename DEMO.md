# 2-Minute Demo Script & Presentation Guide

**Project:** TeamTab  
**Event:** ROAD TO DEVCON – IIITN EDITION | Ethereum Research Workshop & Builders Lab  
**Track:** Account Abstraction & Smart Accounts

---

## 2-Minute Demo Script

### `0:00 – 0:20` | The Problem
> *"Raise your hand if you’ve ever won a hackathon or run a college club, and then spent the next two weeks chasing teammates for receipts, filling out reimbursement spreadsheets, or had your card maxed out because you were the only person paying for API keys and midnight pizzas. Traditional wallets force a false choice: either one person holds the card and bottlenecks every purchase, or you share private keys and risk losing everything."*

---

### `0:20 – 0:40` | The Product
> *"Meet **TeamTab**: a programmable team spending vault powered by **ERC-4337 Account Abstraction** and **Scoped Session Keys**. The team lead funds one account once. Then, they issue scoped cryptographic keys to teammates — each locked to a specific category, a strict budget ceiling, a single-transaction limit, and an expiration timestamp that self-destructs when the hackathon ends."*

---

### `0:40 – 1:30` | Live Demonstration
> *"Let's see it in action:*
> 1. **The Vault Overview:** Here is our team vault for 'Road to Devcon'. You can see 2.50 ETH deposited, 1.68 ETH remaining, and 4 active teammate keys. Notice the on-chain countdown timer.
> 2. **The Spender Persona:** Let's switch to Alex Chen, our AI Lead. Alex has an allowance of 0.50 ETH scoped strictly to 'API Credits & Compute'.
> 3. **Gasless Spending Execution:** Alex needs OpenAI GPT-4o batch credits. He chooses the preset, attaches the invoice, and clicks **Execute Gasless Spend**.
> 4. **Paymaster in Action:** Notice the gas fee breakdown: network gas is 100% sponsored by the TeamTab Paymaster. Alex pays $0.00 in gas, and within seconds the merchant is paid and a verified receipt hash is minted on Sepolia.
> 5. **Live Tab Feed:** The spend immediately appears in our shared Tab Feed with a full audit trail."*

---

### `1:30 – 1:50` | Where Account Abstraction is Used
> *"Why couldn't this be done with regular wallets?*
> 1. **Programmable Permissions:** Session Keys enforce category whitelist and spending ceilings directly at the smart contract level.
> 2. **Gas Abstraction:** Paymasters remove the gas token hurdle so non-crypto teammates don't need testnet ETH.
> 3. **Auto-Expiring Authority:** Authority expires on-chain when the clock hits zero — zero manual key rotation required.
> 
> *Let's jump to the **AA Policy Sandbox** — if Alex tries to spend 0.90 ETH or spend on Food instead of API credits, the Smart Account instantly rejects the transaction on-chain with `ExceedsBudgetCeiling`."*

---

### `1:50 – 2:00` | Future Potential & Conclusion
> *"TeamTab turns team spending into a seamless, trustless, and zero-headache experience. One pot, zero shared cards, zero reimbursement chases. Thank you!"*

---

## Demo Prerequisites & Checklist
- [x] Node.js development server running on `http://localhost:3000`
- [x] Web browser opened in full screen (dark theme mode enabled)
- [x] Active persona set to Lead or Alex Chen (AI Engineer)
- [x] Testnet explorer link tested (`Sepolia Etherscan`)
- [x] Interactive sandbox pre-loaded with demo dataset

## Backup Plan
- If external RPC or internet connectivity drops, TeamTab includes an **Instant Local Sandbox Mode** that simulates on-chain cryptographic state transitions and contract policy engine responses directly in the UI without network dependency.

## Testnet Information
- **Network:** Ethereum Sepolia (Chain ID: `11155111`)
- **Factory Address:** `0x38bDF8a12345678901234567890123456789aBCd`
- **Demo Vault Address:** `0x742d35Cc6634C0532925a3b844Bc454e4438f44e`
- **EntryPoint v0.6:** `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789`
