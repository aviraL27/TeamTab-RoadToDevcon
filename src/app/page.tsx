"use client";

import React, { useState } from "react";
import { useTeamTab } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { VaultStatsCard } from "@/components/VaultStatsCard";
import { MemberKeysManager } from "@/components/MemberKeysManager";
import { SpendTerminal } from "@/components/SpendTerminal";
import { SpendFeed } from "@/components/SpendFeed";
import { AAPolicyInspector } from "@/components/AAPolicyInspector";
import { IssueKeyModal } from "@/components/IssueKeyModal";
import { FundVaultModal } from "@/components/FundVaultModal";
import { ReceiptViewerModal } from "@/components/ReceiptViewerModal";
import { ShareKeyModal } from "@/components/ShareKeyModal";
import { SweepModal } from "@/components/SweepModal";
import { TaggedSpend, ScopedKey } from "@/lib/types";
import { 
  Key, 
  Send, 
  Receipt, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  ChevronRight,
  ExternalLink,
  Code2,
  Lock,
  Layers,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const { vault, currentRole, activeMemberAddress } = useTeamTab();

  // Active Tab View
  const [activeTab, setActiveTab] = useState<"dashboard" | "spend" | "feed" | "sandbox">("dashboard");

  // Modal states
  const [isFundOpen, setIsFundOpen] = useState(false);
  const [isSweepOpen, setIsSweepOpen] = useState(false);
  const [isIssueKeyOpen, setIsIssueKeyOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<TaggedSpend | null>(null);
  const [selectedShareKey, setSelectedShareKey] = useState<ScopedKey | null>(null);

  const activeKey = vault.keys.find(
    (k) => k.member.toLowerCase() === activeMemberAddress.toLowerCase()
  );

  return (
    <div className="min-h-screen flex flex-col bg-eth-dark selection:bg-emerald-500 selection:text-gray-950">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Hero Banner / Problem-Solution Headline */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-950/40 via-gray-900/60 to-cyan-950/40 border border-gray-800/80 backdrop-blur-xl overflow-hidden shadow-2xl">
          
          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>One Pot • Zero Shared Cards • Zero Reimbursement Chases</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                Programmable Team Spending with <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Scoped Session Keys</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                The team lead funds one account and issues each teammate a cryptographic key scoped to a category, a ceiling, and an expiry. Every spend is tagged, receipt-backed, and gas-sponsored.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 p-4 rounded-2xl bg-gray-950/60 border border-gray-800 shrink-0">
              <div className="text-left md:text-right">
                <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Active Pot Status</div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                  {vault.currentBalance} <span className="text-xs text-white">/ {vault.totalDeposited} ETH</span>
                </div>
              </div>
              <span className="text-[11px] text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                {vault.keys.filter(k => k.active).length} Active Spender Keys
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 pt-5 border-t border-gray-800/80 flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-950 shadow-lg shadow-emerald-500/20"
                  : "bg-gray-950/60 hover:bg-gray-850 text-gray-300 border border-gray-800"
              }`}
            >
              <Key className="w-4 h-4" />
              <span>1. Vault & Scoped Keys</span>
            </button>

            <button
              onClick={() => setActiveTab("spend")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "spend"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-gray-950 shadow-lg shadow-cyan-500/20"
                  : "bg-gray-950/60 hover:bg-gray-850 text-gray-300 border border-gray-800"
              }`}
            >
              <Send className="w-4 h-4" />
              <span>2. Member Spend Terminal</span>
            </button>

            <button
              onClick={() => setActiveTab("feed")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "feed"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/20"
                  : "bg-gray-950/60 hover:bg-gray-850 text-gray-300 border border-gray-800"
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>3. Live Tab Feed ({vault.spends.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("sandbox")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "sandbox"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-gray-950 shadow-lg shadow-amber-500/20"
                  : "bg-gray-950/60 hover:bg-gray-850 text-gray-300 border border-gray-800"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>4. AA Policy Sandbox</span>
            </button>
          </div>

        </div>

        {/* Tab 1: Dashboard View (Vault Stats + Keys Manager) */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            {/* Vault Stats Card */}
            <VaultStatsCard
              onOpenFundModal={() => setIsFundOpen(true)}
              onOpenSweepModal={() => setIsSweepOpen(true)}
              onOpenIssueKeyModal={() => setIsIssueKeyOpen(true)}
            />

            {/* Member Keys Manager */}
            <MemberKeysManager
              onOpenIssueModal={() => setIsIssueKeyOpen(true)}
              onOpenShareModal={(key) => setSelectedShareKey(key)}
            />

            {/* Quick Spend Feed Preview */}
            <SpendFeed onOpenReceipt={(spend) => setSelectedReceipt(spend)} />
          </div>
        )}

        {/* Tab 2: Member Spend Terminal */}
        {activeTab === "spend" && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            <SpendTerminal />
            <SpendFeed onOpenReceipt={(spend) => setSelectedReceipt(spend)} />
          </div>
        )}

        {/* Tab 3: Full Spend Feed & Audit Trail */}
        {activeTab === "feed" && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            <SpendFeed onOpenReceipt={(spend) => setSelectedReceipt(spend)} />
          </div>
        )}

        {/* Tab 4: AA Policy Sandbox */}
        {activeTab === "sandbox" && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            <AAPolicyInspector />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 bg-gray-950/70 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400">
              TT
            </div>
            <div>
              <div className="font-bold text-white">TeamTab • ROAD TO DEVCON – IIITN EDITION</div>
              <div className="text-[11px] text-gray-500">Ethereum Research Workshop & Builders Lab • IIIT Nagpur × Bhaisaaab</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-emerald-400 font-mono">
              <Zap className="w-3.5 h-3.5" />
              <span>ERC-4337 Session Keys</span>
            </span>
            <span>•</span>
            <a
              href="https://github.com/aviraL27/TeamTab-RoadToDevcon"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white flex items-center gap-1"
            >
              <span>GitHub Repo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <FundVaultModal isOpen={isFundOpen} onClose={() => setIsFundOpen(false)} />
      <SweepModal isOpen={isSweepOpen} onClose={() => setIsSweepOpen(false)} />
      <IssueKeyModal isOpen={isIssueKeyOpen} onClose={() => setIsIssueKeyOpen(false)} />
      <ReceiptViewerModal spend={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      <ShareKeyModal scopedKey={selectedShareKey} onClose={() => setSelectedShareKey(null)} />

    </div>
  );
}
