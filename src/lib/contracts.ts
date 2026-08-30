export const VAULT_FACTORY_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "vaultAddress", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "lead", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "teamName", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "eventName", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "eventEndTime", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "initialDeposit", "type": "uint256" }
    ],
    "name": "VaultCreated",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_teamName", "type": "string" },
      { "internalType": "string", "name": "_eventName", "type": "string" },
      { "internalType": "uint256", "name": "_eventEndTime", "type": "uint256" }
    ],
    "name": "createTeamTab",
    "outputs": [{ "internalType": "address", "name": "vaultAddress", "type": "address" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllVaults",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "vaultAddress", "type": "address" },
          { "internalType": "address", "name": "lead", "type": "address" },
          { "internalType": "string", "name": "teamName", "type": "string" },
          { "internalType": "string", "name": "eventName", "type": "string" },
          { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
          { "internalType": "uint256", "name": "eventEndTime", "type": "uint256" }
        ],
        "internalType": "struct TeamTabFactory.VaultRecord[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const TEAM_TAB_VAULT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_teamLead", "type": "address" },
      { "internalType": "string", "name": "_teamName", "type": "string" },
      { "internalType": "string", "name": "_hackathonEvent", "type": "string" },
      { "internalType": "uint256", "name": "_eventEndTime", "type": "uint256" }
    ],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "member", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "memberName", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "category", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "ceiling", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "singleTxLimit", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "expiry", "type": "uint256" }
    ],
    "name": "ScopedKeyIssued",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "member", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "unspentAllowance", "type": "uint256" }
    ],
    "name": "ScopedKeyRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "spendId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "member", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "memberName", "type": "string" },
      { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "category", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "purpose", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "receiptHash", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "remainingCeiling", "type": "uint256" }
    ],
    "name": "TaggedSpendExecuted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "funder", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "newBalance", "type": "uint256" }
    ],
    "name": "TabFunded",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "fundTab",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_member", "type": "address" },
      { "internalType": "string", "name": "_memberName", "type": "string" },
      { "internalType": "string", "name": "_category", "type": "string" },
      { "internalType": "uint256", "name": "_ceiling", "type": "uint256" },
      { "internalType": "uint256", "name": "_singleTxLimit", "type": "uint256" },
      { "internalType": "uint256", "name": "_expiry", "type": "uint256" }
    ],
    "name": "issueScopedKey",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_member", "type": "address" }],
    "name": "revokeScopedKey",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address payable", "name": "_recipient", "type": "address" },
      { "internalType": "uint256", "name": "_amount", "type": "uint256" },
      { "internalType": "string", "name": "_category", "type": "string" },
      { "internalType": "string", "name": "_purpose", "type": "string" },
      { "internalType": "string", "name": "_receiptHash", "type": "string" }
    ],
    "name": "executeScopedSpend",
    "outputs": [{ "internalType": "uint256", "name": "spendId", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_member", "type": "address" },
      { "internalType": "address payable", "name": "_recipient", "type": "address" },
      { "internalType": "uint256", "name": "_amount", "type": "uint256" },
      { "internalType": "string", "name": "_category", "type": "string" },
      { "internalType": "string", "name": "_purpose", "type": "string" },
      { "internalType": "string", "name": "_receiptHash", "type": "string" },
      { "internalType": "uint256", "name": "_deadline", "type": "uint256" },
      { "internalType": "bytes", "name": "_signature", "type": "bytes" }
    ],
    "name": "executeScopedSpendWithSignature",
    "outputs": [{ "internalType": "uint256", "name": "spendId", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getVaultSummary",
    "outputs": [
      { "internalType": "address", "name": "lead", "type": "address" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "eventName", "type": "string" },
      { "internalType": "uint256", "name": "endTime", "type": "uint256" },
      { "internalType": "uint256", "name": "currentBalance", "type": "uint256" },
      { "internalType": "uint256", "name": "totalDep", "type": "uint256" },
      { "internalType": "uint256", "name": "totalSp", "type": "uint256" },
      { "internalType": "uint256", "name": "activeMembersCount", "type": "uint256" },
      { "internalType": "uint256", "name": "totalTransactions", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllMembers",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "member", "type": "address" },
          { "internalType": "string", "name": "memberName", "type": "string" },
          { "internalType": "string", "name": "category", "type": "string" },
          { "internalType": "uint256", "name": "ceiling", "type": "uint256" },
          { "internalType": "uint256", "name": "spent", "type": "uint256" },
          { "internalType": "uint256", "name": "singleTxLimit", "type": "uint256" },
          { "internalType": "uint256", "name": "expiry", "type": "uint256" },
          { "internalType": "bool", "name": "active", "type": "bool" }
        ],
        "internalType": "struct TeamTabVault.ScopedKey[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSpendHistory",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "address", "name": "member", "type": "address" },
          { "internalType": "string", "name": "memberName", "type": "string" },
          { "internalType": "address", "name": "recipient", "type": "address" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "string", "name": "category", "type": "string" },
          { "internalType": "string", "name": "purpose", "type": "string" },
          { "internalType": "string", "name": "receiptHash", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "internalType": "struct TeamTabVault.TaggedSpend[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address payable", "name": "_to", "type": "address" },
      { "internalType": "string", "name": "_reason", "type": "string" }
    ],
    "name": "sweepRemainingFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const DEFAULT_FACTORY_ADDRESS = (process.env.NEXT_PUBLIC_VAULT_FACTORY_ADDRESS ||
  "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7") as `0x${string}`;

export const DEFAULT_VAULT_ADDRESS = (process.env.NEXT_PUBLIC_DEMO_VAULT_ADDRESS ||
  "0x742d35Cc6634C0532925a3b844Bc454e4438f44e") as `0x${string}`;
