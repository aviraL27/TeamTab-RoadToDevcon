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
    <header className="sticky top-0 z-40 w-full border-b border-gray-800/80 bg-eth-dark/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Brand & Event Tag */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CreditCard className="w-5 h-5 text-gray-950 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                  Team<span className="text-emerald-400">Tab</span>
                </span>
                <span className="hidden md:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  ERC-4337 Vault
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">
                Road to Devcon – IIITN Edition
              </p>
            </div>
          </div>
        </div>

        {/* Center: Paymaster / Gas Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
          <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 animate-pulse" />
          <span className="font-medium">Paymaster Active</span>
          <span className="text-emerald-500/60">|</span>
          <span className="text-gray-300">Gas Sponsored: <strong className="text-white">$0.00 to Spender</strong></span>
        </div>

        {/* Right: Persona Switcher & Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaOpen(!isPersonaOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-900/90 hover:bg-gray-800 border border-gray-700/70 text-xs text-white transition-all shadow-sm"
              title="Switch Current Simulating Signer / Persona"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                {currentRole === "lead" ? "👑" : "🔑"}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[10px] text-gray-400 leading-none">Simulating as</div>
                <div className="font-semibold text-xs leading-tight">
                  {currentRole === "lead" ? "Lead (Alex Chen)" : activeMember?.memberName || "Member"}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {isPersonaOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-gray-900 border border-gray-700 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-gray-800 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Switch Active Signer
                </div>

                {/* Team Lead Option */}
                <button
                  onClick={() => {
                    setCurrentRole("lead");
                    setIsPersonaOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    currentRole === "lead" ? "bg-emerald-500/20 border border-emerald-500/40 text-white" : "hover:bg-gray-800/80 text-gray-300"
                  }`}
                >
                  <span className="text-lg">👑</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white">Team Lead (Alex)</div>
                    <div className="text-[11px] text-gray-400 truncate">Master Admin • Issue/Revoke Keys</div>
                  </div>
                </button>

                <div className="px-3 pt-2.5 pb-1 text-[10px] uppercase font-semibold text-gray-500">
                  Active Spender Session Keys
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                      currentRole === "spender" && activeMemberAddress.toLowerCase() === key.member.toLowerCase()
                        ? "bg-cyan-500/20 border border-cyan-500/40 text-white"
                        : "hover:bg-gray-800/80 text-gray-300"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center text-xs font-bold text-cyan-400 border border-cyan-500/30 shrink-0">
                      {key.memberName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">{key.memberName}</div>
                      <div className="text-[11px] text-cyan-400 truncate">
                        {key.category} • {(parseFloat(key.ceiling) - parseFloat(key.spent)).toFixed(2)} ETH left
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
            className="p-2 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-700/70 text-gray-400 hover:text-white transition-colors"
            title="Reset to Demo State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Network Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-eth-slate border border-gray-700 text-xs font-medium text-gray-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="hidden sm:inline">Sepolia / Sandbox</span>
          </div>

        </div>
      </div>
    </header>
  );
}
