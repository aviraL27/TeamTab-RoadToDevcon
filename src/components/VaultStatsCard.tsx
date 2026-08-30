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
    <div className="bg-ml-bg border border-ml-border p-8 sm:p-12 relative overflow-hidden">
      
      {/* Background ambient lighting - removed to match brutalist style */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(234,231,221,0.02)_50%,transparent_75%)] bg-[length:4px_4px] pointer-events-none" />

      {/* Top Bar: Vault Metadata & Address */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-ml-border relative z-10">
        <div>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest bg-ml-surface border border-ml-border text-ml-beige">
              {vault.hackathonEvent}
            </span>
            <span className="text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase">Vault //</span>
            <h2 className="text-2xl sm:text-4xl font-display text-ml-beige uppercase tracking-tight mt-1">
              {vault.teamName}
            </h2>
          </div>

          {/* Smart Account Address Pill */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-ml-border text-[10px] font-mono text-ml-beige/60 uppercase bg-ml-surface">
              <ShieldCheck className="w-3 h-3 text-ml-green shrink-0" />
              <span>Smart Vault:</span>
              <span className="text-ml-beige font-bold">{vault.address.slice(0, 8)}...{vault.address.slice(-6)}</span>
              <button
                onClick={handleCopy}
                className="ml-2 text-ml-beige/60 hover:text-ml-beige transition-colors"
                title="Copy Vault Address"
              >
                {copied ? <Check className="w-3 h-3 text-ml-green" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Action Controls for Lead */}
        <div className="flex items-center gap-4 flex-wrap">
          {currentRole === "lead" && (
            <>
              <button
                onClick={onOpenFundModal}
                className="ml-button flex items-center gap-2 bg-ml-green text-ml-bg hover:bg-transparent hover:text-ml-green hover:border-ml-green"
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>Deposit Pot</span>
              </button>

              <button
                onClick={onOpenIssueKeyModal}
                className="ml-button flex items-center gap-2 bg-ml-blue text-ml-bg hover:bg-transparent hover:text-ml-blue hover:border-ml-blue"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Issue Member Key</span>
              </button>

              <button
                onClick={onOpenSweepModal}
                className="ml-button flex items-center gap-2"
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8 relative z-10">
        
        {/* Available Balance */}
        <div className="p-6 border border-ml-border bg-ml-surface hover:border-ml-green transition-colors">
          <div className="text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase flex items-center justify-between">
            <span>Available</span>
            <Coins className="w-4 h-4 text-ml-green" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-display text-ml-beige">{vault.currentBalance}</span>
            <span className="text-xs font-mono text-ml-green">ETH</span>
          </div>
          <div className="text-[10px] font-mono text-ml-beige/60 mt-3 pt-3 border-t border-ml-border">
            ≈ ${(parseFloat(vault.currentBalance) * 3000).toLocaleString()} USD
          </div>
        </div>

        {/* Total Tab Spent */}
        <div className="p-6 border border-ml-border bg-ml-surface hover:border-ml-blue transition-colors">
          <div className="text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase flex items-center justify-between">
            <span>Spent</span>
            <TrendingUp className="w-4 h-4 text-ml-blue" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-display text-ml-beige">{vault.totalSpent}</span>
            <span className="text-xs font-mono text-ml-blue">ETH</span>
          </div>
          <div className="text-[10px] font-mono text-ml-beige/60 mt-3 pt-3 border-t border-ml-border">
            {vault.spends.length} tags
          </div>
        </div>

        {/* Total Funded Pot */}
        <div className="p-6 border border-ml-border bg-ml-surface hover:border-ml-pink transition-colors">
          <div className="text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase flex items-center justify-between">
            <span>Funded Pot</span>
            <Sparkles className="w-4 h-4 text-ml-pink" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-display text-ml-beige">{vault.totalDeposited}</span>
            <span className="text-xs font-mono text-ml-pink">ETH</span>
          </div>
          <div className="text-[10px] font-mono text-ml-beige/60 mt-3 pt-3 border-t border-ml-border">
            {activeKeysCount} active keys
          </div>
        </div>

        {/* Authority Expiration Countdown */}
        <div className="p-6 border border-ml-border bg-ml-surface hover:border-ml-yellow transition-colors">
          <div className="text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase flex items-center justify-between">
            <span>Expiry</span>
            <Clock className="w-4 h-4 text-ml-yellow" />
          </div>
          <div className="mt-4 flex items-baseline gap-1 font-mono text-ml-yellow">
            <span className="text-xl sm:text-2xl font-bold">{timeLeft.days}d</span>
            <span className="text-xs text-ml-yellow/60">:</span>
            <span className="text-xl sm:text-2xl font-bold">{String(timeLeft.hours).padStart(2, "0")}h</span>
            <span className="text-xs text-ml-yellow/60">:</span>
            <span className="text-xl sm:text-2xl font-bold">{String(timeLeft.mins).padStart(2, "0")}m</span>
          </div>
          <div className="text-[10px] font-mono text-ml-beige/60 mt-3 pt-3 border-t border-ml-border">
            Auto-expires on-chain
          </div>
        </div>

      </div>

      {/* Budget Utilization Progress Bar */}
      <div className="mt-8 pt-8 border-t border-ml-border relative z-10">
        <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase mb-3">
          <span>Pot Budget Utilization</span>
          <span className="text-ml-beige">
            {percentSpent}% Used ({vault.totalSpent} / {vault.totalDeposited} ETH)
          </span>
        </div>
        <div className="w-full h-4 border border-ml-border bg-ml-bg overflow-hidden p-0.5">
          <div
            className="h-full bg-ml-beige transition-all duration-500"
            style={{ width: `${percentSpent}%` }}
          />
        </div>
      </div>

    </div>
  );
}
