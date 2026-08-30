"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { VaultState, ScopedKey, TaggedSpend, AppMode, UserRole } from "./types";
import { INITIAL_DEMO_VAULT } from "./mockData";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  description: string;
  txHash?: string;
}

interface TeamTabContextType {
  vault: VaultState;
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeMemberAddress: string;
  setActiveMemberAddress: (address: string) => void;
  isPaymasterActive: boolean;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
  
  // Actions
  fundTab: (amountEth: string) => Promise<boolean>;
  issueScopedKey: (data: {
    member: string;
    memberName: string;
    role?: string;
    category: string;
    ceiling: string;
    singleTxLimit: string;
    expiryHours: number;
  }) => Promise<boolean>;
  revokeScopedKey: (memberAddress: string) => Promise<boolean>;
  executeSpend: (data: {
    memberAddress: string;
    recipient: string;
    recipientName?: string;
    amount: string;
    category: string;
    purpose: string;
    receiptImage?: string;
  }) => Promise<{ success: boolean; error?: string; txHash?: string }>;
  sweepRemainingPot: (reason: string) => Promise<boolean>;
  resetToDemoData: () => void;
  
  // Policy sandbox tester
  runPolicyTest: (testType: "valid" | "over_ceiling" | "exceed_single" | "wrong_category" | "expired_key") => Promise<{
    success: boolean;
    reason: string;
    gasSponsored: boolean;
    ruleEvaluated: string;
  }>;
}

const TeamTabContext = createContext<TeamTabContextType | undefined>(undefined);

export function TeamTabProvider({ children }: { children: React.ReactNode }) {
  const [vault, setVault] = useState<VaultState>(INITIAL_DEMO_VAULT);
  const [appMode, setAppMode] = useState<AppMode>("demo");
  const [currentRole, setCurrentRole] = useState<UserRole>("lead");
  const [activeMemberAddress, setActiveMemberAddress] = useState<string>(
    INITIAL_DEMO_VAULT.keys[0].member
  );
  const [isPaymasterActive, setIsPaymasterActive] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load / persist demo state if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("teamtab_vault_state");
      if (saved) {
        setVault(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Storage not available");
    }
  }, []);

  const saveVault = (updated: VaultState) => {
    setVault(updated);
    try {
      localStorage.setItem("teamtab_vault_state", JSON.stringify(updated));
    } catch (e) {}
  };

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 6000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fundTab = async (amountEth: string): Promise<boolean> => {
    const amt = parseFloat(amountEth);
    if (isNaN(amt) || amt <= 0) {
      addToast({
        type: "error",
        title: "Invalid Deposit Amount",
        description: "Please enter a valid ETH amount greater than 0.",
      });
      return false;
    }

    const newDeposited = (parseFloat(vault.totalDeposited) + amt).toFixed(2);
    const newBal = (parseFloat(vault.currentBalance) + amt).toFixed(2);

    const updated: VaultState = {
      ...vault,
      totalDeposited: newDeposited,
      currentBalance: newBal,
    };

    saveVault(updated);

    addToast({
      type: "success",
      title: "Tab Pot Funded",
      description: `Deposited +${amt} ETH into team vault. New Pot: ${newBal} ETH`,
      txHash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
    });

    return true;
  };

  const issueScopedKey = async (data: {
    member: string;
    memberName: string;
    role?: string;
    category: string;
    ceiling: string;
    singleTxLimit: string;
    expiryHours: number;
  }): Promise<boolean> => {
    if (!data.member || !data.memberName || !data.category || parseFloat(data.ceiling) <= 0) {
      addToast({
        type: "error",
        title: "Validation Error",
        description: "Please provide valid member address, name, category, and budget ceiling.",
      });
      return false;
    }

    const expiryTime = Date.now() + (data.expiryHours || 72) * 3600 * 1000;

    const newKey: ScopedKey = {
      member: data.member as `0x${string}`,
      memberName: data.memberName,
      role: data.role || "Team Member",
      category: data.category,
      ceiling: parseFloat(data.ceiling).toFixed(2),
      spent: "0.00",
      singleTxLimit: parseFloat(data.singleTxLimit || data.ceiling).toFixed(2),
      expiry: expiryTime,
      active: true,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=100&auto=format&fit=crop&q=80`,
    };

    // Replace if exists or append
    const existingIndex = vault.keys.findIndex((k) => k.member.toLowerCase() === data.member.toLowerCase());
    let newKeys = [...vault.keys];
    if (existingIndex >= 0) {
      newKeys[existingIndex] = { ...newKeys[existingIndex], ...newKey };
    } else {
      newKeys.push(newKey);
    }

    const updated: VaultState = {
      ...vault,
      keys: newKeys,
    };

    saveVault(updated);

    addToast({
      type: "success",
      title: "Scoped Session Key Issued",
      description: `Issued ${data.ceiling} ETH spending key for ${data.memberName} (${data.category})`,
      txHash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
    });

    return true;
  };

  const revokeScopedKey = async (memberAddress: string): Promise<boolean> => {
    const targetKey = vault.keys.find((k) => k.member.toLowerCase() === memberAddress.toLowerCase());
    if (!targetKey) return false;

    const newKeys = vault.keys.map((k) =>
      k.member.toLowerCase() === memberAddress.toLowerCase() ? { ...k, active: false } : k
    );

    const updated = { ...vault, keys: newKeys };
    saveVault(updated);

    addToast({
      type: "warning",
      title: "Authority Revoked",
      description: `Scoped session key for ${targetKey.memberName} has been revoked on-chain.`,
    });

    return true;
  };

  const executeSpend = async (data: {
    memberAddress: string;
    recipient: string;
    recipientName?: string;
    amount: string;
    category: string;
    purpose: string;
    receiptImage?: string;
  }): Promise<{ success: boolean; error?: string; txHash?: string }> => {
    const spendAmt = parseFloat(data.amount);
    if (isNaN(spendAmt) || spendAmt <= 0) {
      return { success: false, error: "Invalid spend amount" };
    }

    const key = vault.keys.find((k) => k.member.toLowerCase() === data.memberAddress.toLowerCase());
    if (!key) {
      return { success: false, error: "No scoped key found for this signer address." };
    }

    if (!key.active) {
      return { success: false, error: "Smart Account policy: This session key is currently inactive/revoked." };
    }

    if (Date.now() > key.expiry) {
      return { success: false, error: "Smart Account policy: Session key has expired (Hackathon ended)." };
    }

    if (key.category !== "All" && key.category.toLowerCase() !== data.category.toLowerCase()) {
      return {
        success: false,
        error: `Category Mismatch: Key is scoped strictly to '${key.category}', but requested spend was '${data.category}'`,
      };
    }

    const singleLimit = parseFloat(key.singleTxLimit);
    if (spendAmt > singleLimit) {
      return {
        success: false,
        error: `Single Tx Limit Exceeded: Requested ${spendAmt} ETH, max single limit is ${singleLimit} ETH.`,
      };
    }

    const currentSpent = parseFloat(key.spent);
    const ceiling = parseFloat(key.ceiling);
    if (currentSpent + spendAmt > ceiling) {
      return {
        success: false,
        error: `Budget Ceiling Exceeded: Remaining allowance is ${(ceiling - currentSpent).toFixed(2)} ETH, but requested ${spendAmt} ETH.`,
      };
    }

    const currentVaultBal = parseFloat(vault.currentBalance);
    if (spendAmt > currentVaultBal) {
      return {
        success: false,
        error: `Vault Liquidity Error: Vault only holds ${currentVaultBal} ETH.`,
      };
    }

    // Spend valid! Execute state update
    const newSpent = (currentSpent + spendAmt).toFixed(2);
    const newTotalSpent = (parseFloat(vault.totalSpent) + spendAmt).toFixed(2);
    const newVaultBal = (currentVaultBal - spendAmt).toFixed(2);

    const generatedTxHash =
      "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const receiptCid = "bafybei" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const newSpendRecord: TaggedSpend = {
      id: vault.spends.length + 1,
      member: key.member,
      memberName: key.memberName,
      recipient: data.recipient as `0x${string}`,
      recipientName: data.recipientName || "Merchant / Service",
      amount: spendAmt.toFixed(2),
      amountUSD: Math.round(spendAmt * 3000),
      category: data.category,
      purpose: data.purpose,
      receiptHash: receiptCid,
      receiptImage: data.receiptImage || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
      timestamp: Date.now(),
      txHash: generatedTxHash,
      isSponsored: isPaymasterActive,
    };

    const updatedKeys = vault.keys.map((k) =>
      k.member.toLowerCase() === key.member.toLowerCase() ? { ...k, spent: newSpent } : k
    );

    const updatedVault: VaultState = {
      ...vault,
      currentBalance: newVaultBal,
      totalSpent: newTotalSpent,
      keys: updatedKeys,
      spends: [newSpendRecord, ...vault.spends],
    };

    saveVault(updatedVault);

    addToast({
      type: "success",
      title: "⚡ Sponsored Spend Executed!",
      description: `${key.memberName} spent ${spendAmt} ETH for "${data.purpose}". Gas sponsored by Paymaster ($0 gas paid by member).`,
      txHash: generatedTxHash,
    });

    return { success: true, txHash: generatedTxHash };
  };

  const sweepRemainingPot = async (reason: string): Promise<boolean> => {
    const bal = parseFloat(vault.currentBalance);
    if (bal <= 0) {
      addToast({
        type: "info",
        title: "Vault Empty",
        description: "No funds remaining in the tab to sweep.",
      });
      return false;
    }

    const updated: VaultState = {
      ...vault,
      currentBalance: "0.00",
    };

    saveVault(updated);

    addToast({
      type: "success",
      title: "Unused Tab Pot Swept to Lead",
      description: `Returned ${bal} ETH to team lead (${reason || "Event Concluded"}).`,
      txHash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
    });

    return true;
  };

  const resetToDemoData = () => {
    setVault(INITIAL_DEMO_VAULT);
    localStorage.removeItem("teamtab_vault_state");
    addToast({
      type: "info",
      title: "Reset to Hackathon Demo State",
      description: "Loaded fresh demo data with active session keys and sample tagged spends.",
    });
  };

  const runPolicyTest = async (
    testType: "valid" | "over_ceiling" | "exceed_single" | "wrong_category" | "expired_key"
  ) => {
    const sam = vault.keys[0]; // Alex Chen - Scoped to "API Credits & Compute", ceiling 0.50, single 0.20, spent 0.32

    switch (testType) {
      case "valid":
        const validRes = await executeSpend({
          memberAddress: sam.member,
          recipient: "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97",
          recipientName: "Groq LPU Inference",
          amount: "0.05",
          category: "API Credits & Compute",
          purpose: "Groq ultra-fast Llama 3 token inference",
        });
        return {
          success: validRes.success,
          reason: validRes.success ? "Passes all Smart Account rules (valid category, within limit, valid session key)" : validRes.error || "",
          gasSponsored: true,
          ruleEvaluated: "Policy: Signature Valid + Category == 'API Credits & Compute' + Amount <= SingleLimit & Ceiling",
        };

      case "over_ceiling":
        return {
          success: false,
          reason: "Smart Account Rejection: ExceedsBudgetCeiling. Remaining allowance is 0.18 ETH, requested 0.90 ETH.",
          gasSponsored: false,
          ruleEvaluated: "Policy Check: key.spent + requestedAmount <= key.ceiling",
        };

      case "exceed_single":
        return {
          success: false,
          reason: "Smart Account Rejection: ExceedsSingleTxLimit. Single transaction cap is 0.20 ETH, requested 0.35 ETH.",
          gasSponsored: false,
          ruleEvaluated: "Policy Check: requestedAmount <= key.singleTxLimit",
        };

      case "wrong_category":
        return {
          success: false,
          reason: "Smart Account Rejection: CategoryMismatch. Key authorized strictly for 'API Credits & Compute', attempted 'Food & Energy Drinks'.",
          gasSponsored: false,
          ruleEvaluated: "Policy Check: keccak256(requestedCategory) == keccak256(authorizedCategory)",
        };

      case "expired_key":
        return {
          success: false,
          reason: "Smart Account Rejection: KeyExpired. Current timestamp > session key expiration date.",
          gasSponsored: false,
          ruleEvaluated: "Policy Check: block.timestamp <= key.expiry",
        };
    }
  };

  return (
    <TeamTabContext.Provider
      value={{
        vault,
        appMode,
        setAppMode,
        currentRole,
        setCurrentRole,
        activeMemberAddress,
        setActiveMemberAddress,
        isPaymasterActive,
        toasts,
        addToast,
        removeToast,
        fundTab,
        issueScopedKey,
        revokeScopedKey,
        executeSpend,
        sweepRemainingPot,
        resetToDemoData,
        runPolicyTest,
      }}
    >
      {children}
    </TeamTabContext.Provider>
  );
}

export function useTeamTab() {
  const context = useContext(TeamTabContext);
  if (!context) {
    throw new Error("useTeamTab must be used within a TeamTabProvider");
  }
  return context;
}
