export type Category = 
  | "API Credits & Compute"
  | "Hardware & IoT"
  | "Food & Energy Drinks"
  | "Domain & Hosting"
  | "Travel & Transport"
  | "Design & Assets"
  | "Emergency Misc"
  | "All";

export interface ScopedKey {
  member: `0x${string}` | string;
  memberName: string;
  category: Category | string;
  ceiling: string; // in ETH (e.g. "0.25")
  spent: string;   // in ETH (e.g. "0.08")
  singleTxLimit: string; // in ETH (e.g. "0.10")
  expiry: number;  // timestamp in ms
  active: boolean;
  avatar?: string;
  role?: string;
}

export interface TaggedSpend {
  id: number;
  member: `0x${string}` | string;
  memberName: string;
  recipient: `0x${string}` | string;
  recipientName?: string;
  amount: string; // in ETH
  amountUSD: number;
  category: Category | string;
  purpose: string;
  receiptHash: string;
  receiptImage?: string;
  timestamp: number; // timestamp in ms
  txHash: string;
  isSponsored: boolean;
}

export interface VaultState {
  address: `0x${string}` | string;
  teamLead: `0x${string}` | string;
  teamName: string;
  hackathonEvent: string;
  totalDeposited: string; // in ETH
  currentBalance: string; // in ETH
  totalSpent: string;     // in ETH
  eventEndTime: number;   // timestamp in ms
  keys: ScopedKey[];
  spends: TaggedSpend[];
}

export type AppMode = "demo" | "live";
export type UserRole = "lead" | "spender" | "auditor";
