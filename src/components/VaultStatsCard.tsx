"use client";

import React, { useState, useEffect } from "react";
import { useTeamTab } from "@/lib/store";
import { 
  Coins, 
  TrendingUp, 
  Clock, 
  Users, 
  PlusCircle, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight
} from "lucide-react";

interface VaultStatsCardProps {
  onOpenFundModal: () => void;
  onOpenSweepModal: () => void;
  onOpenIssueKeyModal: () => void;
}

export function VaultStatsCard({ 
  onOpenFundModal, 
  onOpenSweepModal,
  onOpenIssueKeyModal 
}: VaultStatsCardProps) {
  const { vault, currentRole } = useTeamTab();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; mins: number; secs: number }>({
    days: 2,
    hours: 23,
    mins: 59,
    secs: 45,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const diff = Math.max(0, vault.eventEndTime - Date.now());
      const days = Math.floor(diff / (24 * 3600 * 1000));
      const hours = Math.floor((diff % (24 * 3600 * 1000)) / (3600 * 1000));
      const mins = Math.floor((diff % (3600 * 1000)) / (60 * 1000));
      const secs = Math.floor((diff % (60 * 1000)) / 1000);
      setTimeLeft({ days, hours, mins, secs });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [vault.eventEndTime]);

  const handleCopy = () => {
    navigator.clipboard.writeText(vault.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalDep = parseFloat(vault.totalDeposited);
  const currentBal = parseFloat(vault.currentBalance);
  const totalSp = parseFloat(vault.totalSpent);
  const percentSpent = totalDep > 0 ? Math.min(100, Math.round((totalSp / totalDep) * 100)) : 0;
  const activeKeysCount = vault.keys.filter((k) => k.active).length;

  return (
    <div className="rounded-3xl bg-gradient-to-b from-gray-900/90 via-gray-900/60 to-eth-slate/90 border border-gray-800/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-48 -mb-48" />

      {/* Top Bar: Vault Metadata & Address */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-800/70">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {vault.hackathonEvent}
            </span>
            <span className="text-xs text-gray-400">Team Vault:</span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {vault.teamName}
            </h2>
          </div>

          {/* Smart Account Address Pill */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-950/70 border border-gray-800 text-xs font-mono text-gray-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-gray-400">Smart Vault:</span>
              <span className="text-emerald-400 font-semibold">{vault.address.slice(0, 8)}...{vault.address.slice(-6)}</span>
              <button
                onClick={handleCopy}
                className="ml-1 text-gray-400 hover:text-white p-0.5 rounded transition-colors"
                title="Copy Vault Address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Action Controls for Lead */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {currentRole === "lead" && (
            <>
              <button
                onClick={onOpenFundModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-gray-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>Deposit Pot</span>
              </button>

              <button
                onClick={onOpenIssueKeyModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Issue Member Key</span>
              </button>

              <button
                onClick={onOpenSweepModal}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 text-gray-300 hover:text-white font-semibold text-xs sm:text-sm transition-colors"
                title="Sweep unspent funds back to Lead after event"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Sweep Pot</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-6">
        
        {/* Available Balance */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gray-950/50 border border-emerald-500/20 relative overflow-hidden">
          <div className="text-xs text-gray-400 font-medium flex items-center justify-between">
            <span>Available Balance</span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-white">{vault.currentBalance}</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">ETH</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            ≈ ${(parseFloat(vault.currentBalance) * 3000).toLocaleString()} USD
          </div>
        </div>

        {/* Total Tab Spent */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gray-950/50 border border-cyan-500/20 relative overflow-hidden">
          <div className="text-xs text-gray-400 font-medium flex items-center justify-between">
            <span>Total Spent</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-white">{vault.totalSpent}</span>
            <span className="text-sm font-bold text-cyan-400 font-mono">ETH</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            {vault.spends.length} tagged transactions
          </div>
        </div>

        {/* Total Funded Pot */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gray-950/50 border border-gray-800 relative overflow-hidden">
          <div className="text-xs text-gray-400 font-medium flex items-center justify-between">
            <span>Total Funded Pot</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-white">{vault.totalDeposited}</span>
            <span className="text-sm font-bold text-purple-400 font-mono">ETH</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            {activeKeysCount} active session keys
          </div>
        </div>

        {/* Authority Expiration Countdown */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gray-950/50 border border-amber-500/20 relative overflow-hidden">
          <div className="text-xs text-gray-400 font-medium flex items-center justify-between">
            <span>Authority Expiry</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1 font-mono text-amber-300 font-bold">
            <span className="text-lg sm:text-2xl font-black">{timeLeft.days}d</span>
            <span className="text-xs">:</span>
            <span className="text-lg sm:text-2xl font-black">{String(timeLeft.hours).padStart(2, "0")}h</span>
            <span className="text-xs">:</span>
            <span className="text-lg sm:text-2xl font-black">{String(timeLeft.mins).padStart(2, "0")}m</span>
            <span className="text-xs">:</span>
            <span className="text-sm font-normal text-amber-400/80">{String(timeLeft.secs).padStart(2, "0")}s</span>
          </div>
          <div className="text-[11px] text-amber-400/70 mt-1">
            Auto-expires on-chain
          </div>
        </div>

      </div>

      {/* Budget Utilization Progress Bar */}
      <div className="mt-6 pt-5 border-t border-gray-800/70">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>Pot Budget Utilization</span>
          <span className="font-semibold text-gray-200">
            {percentSpent}% Used ({vault.totalSpent} / {vault.totalDeposited} ETH)
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-gray-950 overflow-hidden p-0.5 border border-gray-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 transition-all duration-500 shadow-sm"
            style={{ width: `${percentSpent}%` }}
          />
        </div>
      </div>

    </div>
  );
}
