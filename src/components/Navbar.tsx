"use client";

import React, { useState } from "react";
import { useTeamTab } from "@/lib/store";
import { 
  Zap, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Key, 
  ChevronDown,
  ExternalLink,
  Flame,
  CreditCard
} from "lucide-react";

export function Navbar() {
  const { 
    vault, 
    appMode, 
    setAppMode, 
    currentRole, 
    setCurrentRole, 
    activeMemberAddress, 
    setActiveMemberAddress, 
    isPaymasterActive, 
    resetToDemoData 
  } = useTeamTab();

  const [isPersonaOpen, setIsPersonaOpen] = useState(false);

  const activeMember = vault.keys.find(
    (k) => k.member.toLowerCase() === activeMemberAddress.toLowerCase()
  ) || vault.keys[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ml-border bg-ml-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Brand & Event Tag */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 border border-ml-border flex items-center justify-center bg-ml-bg hover:bg-ml-surface transition-colors cursor-pointer">
              <CreditCard className="w-6 h-6 text-ml-beige" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="font-display text-2xl tracking-tight text-ml-beige uppercase">
                  TEAM<span className="text-ml-pink">TAB</span>
                </span>
                <span className="hidden md:inline-flex text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 border border-ml-border text-ml-beige bg-ml-surface">
                  ERC-4337
                </span>
              </div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-ml-beige/60">
                ROAD TO DEVCON
              </p>
            </div>
          </div>
        </div>

        {/* Center: Paymaster / Gas Status Pill */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-2 border border-ml-border text-xs text-ml-green font-mono uppercase tracking-widest bg-ml-bg">
          <Zap className="w-4 h-4 text-ml-green animate-pulse" />
          <span>Paymaster Active</span>
          <span className="text-ml-border">|</span>
          <span className="text-ml-beige/60">Sponsored: <strong className="text-ml-beige">$0.00</strong></span>
        </div>

        {/* Right: Persona Switcher & Controls */}
        <div className="flex items-center gap-3">
          
          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaOpen(!isPersonaOpen)}
              className="flex items-center gap-3 px-4 py-2 border border-ml-border bg-ml-bg hover:bg-ml-surface transition-colors text-xs text-ml-beige font-mono uppercase tracking-widest"
              title="Switch Current Simulating Signer / Persona"
            >
              <div className="w-6 h-6 border border-ml-border flex items-center justify-center text-[12px] bg-ml-bg text-ml-beige">
                {currentRole === "lead" ? "L" : "M"}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[9px] text-ml-beige/60 leading-none">ROLE</div>
                <div className="font-bold text-[11px] leading-tight mt-1 text-ml-beige">
                  {currentRole === "lead" ? "LEAD (ALEX)" : activeMember?.memberName || "MEMBER"}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-ml-beige/60" />
            </button>

            {isPersonaOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-ml-bg border border-ml-border p-2 z-50 animate-in fade-in slide-in-from-top-2 shadow-2xl">
                <div className="px-3 py-3 border-b border-ml-border text-[10px] font-mono uppercase tracking-widest text-ml-beige/60">
                  Switch Active Signer
                </div>

                {/* Team Lead Option */}
                <button
                  onClick={() => {
                    setCurrentRole("lead");
                    setIsPersonaOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors font-mono ${
                    currentRole === "lead" ? "bg-ml-surface border border-ml-border text-ml-beige" : "hover:bg-ml-surface/50 text-ml-beige/80"
                  }`}
                >
                  <span className="text-sm font-display text-ml-blue border border-ml-border p-1">LD</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] uppercase font-bold text-ml-beige">Team Lead (Alex)</div>
                    <div className="text-[9px] uppercase tracking-widest text-ml-beige/60 truncate mt-1">Master Admin</div>
                  </div>
                </button>

                <div className="px-3 pt-4 pb-2 text-[10px] uppercase font-mono tracking-widest text-ml-beige/60 border-t border-ml-border mt-2">
                  Active Session Keys
                </div>

                {/* Spender Keys */}
                {vault.keys.filter(k => k.active).map((key) => (
                  <button
                    key={key.member}
                    onClick={() => {
                      setCurrentRole("spender");
                      setActiveMemberAddress(key.member);
                      setIsPersonaOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors font-mono mt-1 ${
                      currentRole === "spender" && activeMemberAddress.toLowerCase() === key.member.toLowerCase()
                        ? "bg-ml-surface border border-ml-border text-ml-beige"
                        : "hover:bg-ml-surface/50 text-ml-beige/80"
                    }`}
                  >
                    <div className="w-8 h-8 border border-ml-border flex items-center justify-center text-xs font-display text-ml-pink bg-ml-bg shrink-0">
                      {key.memberName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-ml-beige uppercase truncate">{key.memberName}</div>
                      <div className="text-[9px] text-ml-beige/60 uppercase tracking-widest truncate mt-1">
                        {key.category}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Demo Button */}
          <button
            onClick={resetToDemoData}
            className="p-2.5 border border-ml-border bg-ml-bg hover:bg-ml-surface transition-colors text-ml-beige"
            title="Reset to Demo State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Network Badge */}
          <div className="flex items-center gap-2 px-4 py-2 border border-ml-border text-[10px] font-mono uppercase tracking-widest text-ml-beige bg-ml-bg">
            <span className="w-2 h-2 rounded-none bg-ml-pink animate-pulse" />
            <span className="hidden sm:inline">SEPOLIA TESTNET</span>
          </div>

        </div>
      </div>
    </header>
  );
}
