"use client";

import React, { useState } from "react";
import { ScopedKey } from "@/lib/types";
import { X, QrCode, Copy, Check, ShieldCheck, Share2, Sparkles } from "lucide-react";

interface ShareKeyModalProps {
  scopedKey: ScopedKey | null;
  onClose: () => void;
}

export function ShareKeyModal({ scopedKey, onClose }: ShareKeyModalProps) {
  const [copied, setCopied] = useState(false);

  if (!scopedKey) return null;

  const passUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/?memberKey=${scopedKey.member}&category=${encodeURIComponent(scopedKey.category)}`
    : `https://teamtab.eth/?memberKey=${scopedKey.member}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(passUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-gray-900 border border-gray-700 shadow-2xl p-6 sm:p-8 relative text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge */}
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto mb-3">
          <QrCode className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-bold text-white">Member Session Pass</h3>
        <p className="text-xs text-gray-400 mt-1">
          Share this instant spending pass with <strong className="text-white">{scopedKey.memberName}</strong>.
        </p>

        {/* Visual Pass Card */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border border-cyan-500/30 text-left relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400 pb-2 border-b border-gray-800">
            <span>TEAMTAB SESSION PASS</span>
            <span className="text-emerald-400 font-mono">ERC-4337</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="font-bold text-white text-sm">{scopedKey.memberName}</div>
              <div className="text-[11px] text-cyan-400 font-semibold">{scopedKey.category}</div>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs text-gray-400">Ceiling</div>
              <div className="font-bold text-emerald-400">{scopedKey.ceiling} ETH</div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-gray-800 flex items-center justify-between text-[10px] text-gray-500 font-mono">
            <span>KEY: {scopedKey.member.slice(0, 10)}...</span>
            <span className="text-amber-400">AUTO-EXPIRES</span>
          </div>
        </div>

        {/* Share Link */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={passUrl}
            className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-[11px] font-mono text-gray-300 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs transition-colors shrink-0"
            title="Copy Pass Link"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200"
        >
          Done
        </button>

      </div>
    </div>
  );
}
