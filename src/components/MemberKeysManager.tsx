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
    <div className="rounded-3xl bg-gray-900/80 border border-gray-800/80 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Issued Session Keys & Scoped Permissions
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            ERC-4337 session keys grant members autonomous spending authority bounded by ceiling and category.
          </p>
        </div>

        {currentRole === "lead" && (
          <button
            onClick={onOpenIssueModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Issue New Key</span>
          </button>
        )}
      </div>

      {/* Keys Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {vault.keys.map((k) => {
          const catMeta = getCategoryMeta(k.category);
          const spent = parseFloat(k.spent);
          const ceiling = parseFloat(k.ceiling);
          const remaining = Math.max(0, ceiling - spent).toFixed(2);
          const percentUsed = ceiling > 0 ? Math.min(100, Math.round((spent / ceiling) * 100)) : 0;
          const isSelected = currentRole === "spender" && activeMemberAddress.toLowerCase() === k.member.toLowerCase();

          return (
            <div
              key={k.member}
              className={`rounded-2xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between ${
                !k.active
                  ? "bg-gray-950/40 border-gray-800/50 opacity-60"
                  : isSelected
                  ? "bg-cyan-950/20 border-cyan-500/50 shadow-lg shadow-cyan-950/50"
                  : "bg-gray-950/60 border-gray-800/80 hover:border-gray-700"
              }`}
            >
              <div>
                {/* Top Row: User Avatar, Name & Category Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={k.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                      alt={k.memberName}
                      className="w-10 h-10 rounded-xl object-cover border border-gray-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{k.memberName}</span>
                        {k.active ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-400" title="Active Key" />
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-semibold">Revoked</span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono">
                        {k.member.slice(0, 6)}...{k.member.slice(-4)}
                      </div>
                    </div>
                  </div>

                  {/* Category Pill */}
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${catMeta.color} shrink-0`}>
                    {k.category}
                  </span>
                </div>

                {/* Allowance Metrics */}
                <div className="mt-4 pt-3 border-t border-gray-800/60">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-gray-400">Allowance Used:</span>
                    <span className="font-semibold text-white font-mono">
                      {k.spent} / {k.ceiling} ETH
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-gray-900 overflow-hidden border border-gray-800">
                    <div
                      className={`h-full rounded-full transition-all ${
                        percentUsed > 80
                          ? "bg-rose-500"
                          : percentUsed > 50
                          ? "bg-amber-400"
                          : "bg-emerald-400"
                      }`}
                      style={{ width: `${percentUsed}%` }}
                    />
                  </div>

                  {/* Limits summary */}
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mt-3 font-mono">
                    <div>
                      <span>Remaining: </span>
                      <strong className="text-emerald-400">{remaining} ETH</strong>
                    </div>
                    <div>
                      <span>Single Tx Cap: </span>
                      <strong className="text-cyan-400">{k.singleTxLimit} ETH</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-gray-800/60">
                <button
                  onClick={() => onOpenShareModal(k)}
                  className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-gray-800/70 hover:bg-gray-700/70 transition-colors"
                  title="Share Key Link & QR Pass"
                >
                  <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Pass</span>
                </button>

                <div className="flex items-center gap-2">
                  {k.active && currentRole === "lead" && (
                    <button
                      onClick={() => handleRevoke(k.member)}
                      disabled={revokingMember === k.member}
                      className="text-xs text-rose-400 hover:text-rose-300 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="Revoke session key immediately"
                    >
                      {revokingMember === k.member ? "Revoking..." : "Revoke"}
                    </button>
                  )}

                  {k.active && (
                    <button
                      onClick={() => handleSwitchToMember(k.member)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                        isSelected
                          ? "bg-cyan-500 text-gray-950"
                          : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      <span>{isSelected ? "Active Spender" : "Spend as " + k.memberName.split(" ")[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
