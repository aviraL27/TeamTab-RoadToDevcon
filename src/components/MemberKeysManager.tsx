"use client";

import React, { useState } from "react";
import { useTeamTab } from "@/lib/store";
import { ScopedKey } from "@/lib/types";
import { 
  Key, 
  Plus, 
  ShieldAlert, 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Lock,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { CATEGORY_OPTIONS } from "@/lib/mockData";

interface MemberKeysManagerProps {
  onOpenIssueModal: () => void;
  onOpenShareModal: (key: ScopedKey) => void;
}

export function MemberKeysManager({ onOpenIssueModal, onOpenShareModal }: MemberKeysManagerProps) {
  const { vault, currentRole, revokeScopedKey, setCurrentRole, setActiveMemberAddress, activeMemberAddress } = useTeamTab();
  const [revokingMember, setRevokingMember] = useState<string | null>(null);

  const getCategoryMeta = (cat: string) => {
    return CATEGORY_OPTIONS.find((c) => c.value === cat) || CATEGORY_OPTIONS[0];
  };

  const handleRevoke = async (memberAddress: string) => {
    setRevokingMember(memberAddress);
    await revokeScopedKey(memberAddress);
    setRevokingMember(null);
  };

  const handleSwitchToMember = (memberAddress: string) => {
    setCurrentRole("spender");
    setActiveMemberAddress(memberAddress);
  };

  return (
    <div className="bg-ml-bg border border-ml-border p-8 sm:p-12 relative overflow-hidden mt-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-ml-border">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-ml-border flex items-center justify-center bg-ml-blue text-ml-bg">
              <Key className="w-4 h-4 fill-current" />
            </div>
            <h3 className="text-xl sm:text-2xl font-display text-ml-beige uppercase tracking-tight mt-1">
              Active Keys
            </h3>
          </div>
          <p className="text-[10px] font-mono tracking-widest text-ml-beige/60 mt-3 uppercase">
            Manage scoped session keys for the team pot.
          </p>
        </div>

        {currentRole === "lead" && (
          <button
            onClick={onOpenIssueModal}
            className="flex items-center gap-2 px-6 py-3 border border-ml-beige text-ml-beige hover:bg-ml-beige hover:text-ml-bg text-[10px] font-mono font-bold uppercase tracking-widest transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Issue New Key</span>
          </button>
        )}
      </div>

      {/* Keys Grid */}
      <div className="mt-8 space-y-4">
        {vault.keys.length === 0 ? (
          <div className="text-center py-12 border border-ml-border border-dashed text-ml-beige/40 text-[10px] font-mono uppercase tracking-widest">
            No session keys issued yet.
          </div>
        ) : (
          vault.keys.map((key) => {
            const numCeiling = parseFloat(key.ceiling) || 0;
            const numSpent = parseFloat(key.spent) || 0;
            const percentSpent = numCeiling > 0 ? Math.min(100, (numSpent / numCeiling) * 100) : 0;
            const isSelected = currentRole === "spender" && activeMemberAddress.toLowerCase() === key.member.toLowerCase();
            
            return (
              <div
                key={key.member}
                className={`p-4 sm:p-6 border transition-all flex flex-col md:flex-row gap-6 relative ${
                  key.active
                    ? "bg-ml-surface border-ml-border"
                    : "bg-ml-bg border-ml-border/50 opacity-60 grayscale"
                }`}
              >


                {/* Left: Member Identity */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <img
                    src={key.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                    alt={key.memberName}
                    className="w-12 h-12 border border-ml-border object-cover grayscale"
                  />
                  <div>
                    <h4 className="font-bold text-ml-beige uppercase tracking-widest text-sm">{key.memberName}</h4>
                    <p className="text-[10px] text-ml-beige/60 font-mono uppercase tracking-widest mt-1">
                      {key.member.slice(0, 6)}...{key.member.slice(-4)}
                    </p>
                  </div>
                </div>

                {/* Center: Scopes & Budget */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] font-mono tracking-widest text-ml-beige/40 uppercase block mb-1">
                        Allowed Category
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-widest border border-ml-blue/30 text-ml-blue px-2 py-1">
                        {key.category}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono tracking-widest text-ml-beige/40 uppercase block mb-1">
                        Single Tx Limit
                      </span>
                      <span className="text-xs font-mono font-bold text-ml-beige">
                        {key.singleTxLimit} ETH
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase mb-2">
                      <span>Total Allowance Used</span>
                      <span className="text-ml-beige font-bold">
                        {key.spent} / {key.ceiling} ETH
                      </span>
                    </div>
                    <div className="w-full h-2 border border-ml-border bg-ml-bg p-0.5">
                      <div
                        className={`h-full transition-all duration-500 ${
                          percentSpent > 90 ? "bg-ml-pink" : "bg-ml-blue"
                        }`}
                        style={{ width: `${percentSpent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col items-center justify-start gap-3 pt-4 md:pt-0 md:pl-4 border-t md:border-t-0 md:border-l border-ml-border min-w-[140px]">
                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 mb-2 w-full justify-center">
                    {key.active ? (
                      <span className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-ml-green uppercase border border-ml-green/30 bg-ml-green/10 px-2 py-1 w-full justify-center">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active Key</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-ml-pink uppercase border border-ml-pink/30 bg-ml-pink/10 px-2 py-1 w-full justify-center">
                        <XCircle className="w-3 h-3" />
                        <span>Revoked</span>
                      </span>
                    )}
                  </div>
                  {key.active && currentRole === "lead" && (
                    <button
                      onClick={() => handleRevoke(key.member)}
                      disabled={revokingMember === key.member}
                      className="px-4 py-2 border border-ml-pink text-[9px] font-mono uppercase tracking-widest text-ml-pink hover:bg-ml-pink hover:text-ml-bg transition-colors w-full"
                    >
                      {revokingMember === key.member ? "Revoking..." : "Revoke Key"}
                    </button>
                  )}
                  {key.active && (
                    <button
                      onClick={() => handleSwitchToMember(key.member)}
                      className={`px-4 py-2 text-[9px] font-mono uppercase tracking-widest w-full flex items-center justify-between gap-2 border transition-all ${
                        isSelected ? "bg-ml-beige text-ml-bg border-ml-beige" : "bg-ml-surface border-ml-border text-ml-beige hover:border-ml-beige"
                      }`}
                    >
                      <span>{isSelected ? "Active Spender" : "Spend As"}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => onOpenShareModal(key)}
                    className="flex items-center gap-2 text-[9px] font-mono tracking-widest text-ml-beige/60 hover:text-ml-beige transition-colors uppercase mt-2"
                  >
                    <QrCode className="w-3 h-3" />
                    <span>Pass</span>
                  </button>
                </div>
              </div>
          );
          })
        )}
      </div>

    </div>
  );
}
