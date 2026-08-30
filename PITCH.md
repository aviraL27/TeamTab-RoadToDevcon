# TeamTab - Project Presentation Summary

**ROAD TO DEVCON – IIITN EDITION**  
*Ethereum Research Workshop & Builders Lab | IIIT Nagpur × Bhaisaaab*

---

## 1. Project Name
**TeamTab**

## 2. One-Line Pitch
*One pot, zero shared cards, zero reimbursement chases: Programmable, scoped session keys for hackathon & club team spending.*

---

## 3. Problem
Every hackathon squad and university club suffers from the **Team Spending Bottleneck**:
- **Single Spender Burden:** Whoever holds the card or crypto pot is constantly interrupted to buy API credits, sensor hardware, food, or cloud servers.
- **The "Reimbursement Nightmare":** Teammates pay out of pocket, lose receipts, and spend weeks after the event fighting over spreadsheets and bank transfers.
- **All-or-Nothing Custody:** Sharing an EOA private key or credit card gives total, irreversible access to all funds.
- **Gas Friction:** Team members cannot execute transactions without holding native gas tokens (ETH) in their personal wallets.

---

## 4. Solution
TeamTab provides **Programmable Delegated Spending**:
1. **One Funded Smart Vault:** The team lead deposits funds into `TeamTabVault.sol` once.
2. **Role-Scoped Session Keys:** Lead issues cryptographic session keys with hard mathematical boundaries:
   - **Category Restriction** (*API Credits & Compute*, *Hardware*, *Food*, *Domain/Hosting*)
   - **Budget Ceiling** (*e.g. 0.50 ETH max lifetime*)
   - **Single Transaction Limit** (*e.g. 0.20 ETH max per spend*)
   - **Expiration Timestamp** (*auto-expires when event finishes*)
3. **Gasless Spends via Paymaster:** Teammates execute UserOps with $0.00 gas paid out of pocket.
4. **Permanent Tagged Audit Trail:** Every spend logs recipient, purpose, and IPFS receipt proof on-chain.
5. **One-Click Post-Event Sweep:** Lead sweeps unspent funds back to treasury at hackathon conclusion.

---

## 5. Target Users
- **Hackathon Teams:** Rapidly deploy funds for AI compute tokens, IoT sensors, food, and deployment domains during 36-to-48 hour hackathons.
- **University Clubs & Societies:** Enable sub-committees (Logistics, Tech, Design) to spend within approved semester budgets without handing over the club bank card.
- **DAO Working Groups & Guilds:** Event cohorts spending from an allocated grant pot with automated expense categorization.

---

## 6. Why Ethereum & Account Abstraction?
- **Why Ethereum?** Provides an immutable, trustless settlement layer and transparent audit log that prevents disputes between teammates and organizers.
- **Why Account Abstraction (ERC-4337)?** 
  - **Programmable Policies:** Traditional EOAs cannot enforce spending caps or category restrictions; Smart Accounts can.
  - **Session Keys:** Enables subordinate keys that can sign transactions without holding master wallet custody.
  - **Paymasters:** Sponsors gas fees so team members without crypto onboarding can participate frictionlessly.

---

## 7. Main Innovation
- **Granular Category-Scoped Session Keys:** Merging ERC-4337 session keys with on-chain category whitelisting and single-tx throttling.
- **Zero-Friction Pass Distribution:** Teammates can be onboarded in 5 seconds via a 1-click ephemeral pass link or QR code.
- **Cryptographic Expiration:** Spending authority self-destructs on-chain when the countdown timer reaches zero, eliminating manual key revocation overhead.

---

## 8. Architecture Summary
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Lucide Icons.
- **Blockchain / AA:** Solidity `^0.8.20`, ERC-4337 UserOperations, Scoped Session Keys, EIP-712 Typed Data, Paymaster Gas Sponsorship.
- **Storage & Indexing:** On-chain `TaggedSpendExecuted` events + IPFS receipt hashes.

---

## 9. Demo Flow
1. **Explore Vault Dashboard:** Total pot, remaining balance, active keys, and countdown timer.
2. **Switch Persona:** Switch to Alex Chen (AI Engineer with 0.50 ETH allowance for API Credits).
3. **Execute Gasless Spend:** Select OpenAI preset, attach invoice, execute spend ($0 gas paid by Alex).
4. **Inspect Live Feed:** Real-time expense feed with verified receipt modal and Sepolia tx hash.
5. **AA Policy Sandbox:** Trigger test violations (over-budget spend, wrong category) to demonstrate on-chain Smart Account reverts.

---

## 10. Future Roadmap
- **Q1 2025:** Multi-currency support (USDC / USDT via Uniswap v4 auto-swap).
- **Q2 2025:** Physical NFC Tap-to-Pay wristbands loaded with ephemeral session keys for IRL hackathons.
- **Q3 2025:** ZK-Proof Expense Privacy to shield proprietary project purchases while maintaining mathematical budget proofs.
