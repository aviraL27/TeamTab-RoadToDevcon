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
      <main className="flex-1 w-full flex flex-col space-y-0">
        
        {/* Hero Banner / Problem-Solution Headline */}
        <div className="relative border-b border-ml-border p-12 sm:p-24 overflow-hidden bg-ml-bg text-center min-h-[60vh] flex flex-col justify-center">
          
          <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center w-full">
            <div className="text-[11px] font-mono tracking-[0.2em] text-ml-beige/60 uppercase mb-8 flex items-center justify-center gap-4">
              <span>TEAMTAB — V1</span>
              <span className="w-12 h-[1px] bg-ml-border"></span>
              <span>EST. 2026</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl lg:text-[7rem] font-display text-ml-beige leading-[0.85] tracking-tighter uppercase relative z-20">
              PROGRAMMABLE<br/>SPENDING
            </h1>
            
            <div className="mt-12 flex justify-center w-full relative z-30">
               <div className="inline-flex items-center gap-3 px-8 py-4 border border-ml-border rounded-full hover:border-ml-beige transition-colors text-ml-beige text-xs font-mono uppercase tracking-widest bg-ml-surface/50 backdrop-blur-md cursor-pointer group">
                  <Sparkles className="w-4 h-4 group-hover:text-ml-pink transition-colors" />
                  <span>THE SITUATION</span>
               </div>
            </div>
          </div>

          {/* Floating visual assets replacing neon glows */}
          <div className="absolute top-20 left-[15%] w-40 h-24 bg-ml-bg border border-ml-border flex flex-col items-center justify-center text-[10px] font-mono text-ml-blue rotate-[-12deg] shadow-2xl hover:rotate-0 transition-transform duration-500 z-10">
            <ShieldCheck className="w-8 h-8 mb-2" />
            <span>[ SECURE VAULT ]</span>
          </div>
          
          <div className="absolute bottom-20 right-[15%] w-32 h-32 bg-ml-yellow text-ml-bg flex flex-col items-center justify-center font-display text-4xl rotate-[15deg] shadow-2xl hover:rotate-0 transition-transform duration-500 z-10 rounded-sm">
            <span>4337</span>
            <span className="text-[10px] font-mono tracking-widest mt-2 uppercase">ERC Standard</span>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-10 flex flex-col items-end gap-2 text-[10px] font-mono text-ml-border uppercase tracking-widest">
             <span>||||||||||||</span>
             <span>SCROLL DOWN</span>
             <span>||||||||||||</span>
          </div>
        </div>

        {/* Navigation Tabs - Full Width Brutalist */}
        <div className="border-b border-ml-border flex items-stretch overflow-x-auto scrollbar-none bg-ml-bg">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-5 text-xs font-mono uppercase tracking-widest transition-all whitespace-nowrap border-r border-ml-border ${
              activeTab === "dashboard"
                ? "bg-ml-beige text-ml-bg font-bold"
                : "text-ml-beige/70 hover:bg-ml-surface hover:text-ml-beige"
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Vault & Keys</span>
          </button>

          <button
            onClick={() => setActiveTab("spend")}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-5 text-xs font-mono uppercase tracking-widest transition-all whitespace-nowrap border-r border-ml-border ${
              activeTab === "spend"
                ? "bg-ml-pink text-ml-bg font-bold"
                : "text-ml-beige/70 hover:bg-ml-surface hover:text-ml-beige"
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Terminal</span>
          </button>

          <button
            onClick={() => setActiveTab("feed")}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-5 text-xs font-mono uppercase tracking-widest transition-all whitespace-nowrap border-r border-ml-border ${
              activeTab === "feed"
                ? "bg-ml-green text-ml-bg font-bold"
                : "text-ml-beige/70 hover:bg-ml-surface hover:text-ml-beige"
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Live Feed</span>
          </button>

          <button
            onClick={() => setActiveTab("sandbox")}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-5 text-xs font-mono uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === "sandbox"
                ? "bg-ml-blue text-ml-bg font-bold"
                : "text-ml-beige/70 hover:bg-ml-surface hover:text-ml-beige"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sandbox</span>
          </button>
        </div>
        
        {/* Content Container */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">

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

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-ml-border bg-ml-bg py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-ml-beige/60 font-mono">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-ml-border flex items-center justify-center font-bold text-ml-beige">
              TT
            </div>
            <div>
              <div className="font-bold text-ml-beige uppercase tracking-wider">TEAMTAB — DEVCON</div>
              <div className="text-[10px]">Ethereum Research Workshop</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-ml-yellow" />
              <span>ERC-4337 READY</span>
            </span>
            <a
              href="https://github.com/aviraL27/TeamTab-RoadToDevcon"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ml-beige hover:text-ml-pink transition-colors flex items-center gap-2"
            >
              <span>SOURCE</span>
              <ExternalLink className="w-4 h-4" />
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
