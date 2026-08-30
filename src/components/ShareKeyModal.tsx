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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ml-bg/90 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-ml-bg border border-ml-border p-8 relative text-center shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-ml-surface border border-ml-border hover:bg-ml-beige hover:text-ml-bg text-ml-beige transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Badge */}
        <div className="w-16 h-16 border border-ml-border flex items-center justify-center bg-ml-blue text-ml-bg mx-auto mb-6">
          <QrCode className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-display text-ml-beige uppercase tracking-tight">Session Pass</h3>
        <p className="text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase mt-2">
          Share this pass with <strong className="text-ml-beige">{scopedKey.memberName}</strong>.
        </p>

        {/* Visual Pass Card */}
        <div className="mt-8 p-6 bg-ml-surface border border-ml-border text-left relative overflow-hidden group">
          <div className="flex items-center justify-between text-[9px] font-mono tracking-widest uppercase text-ml-beige/40 pb-4 border-b border-ml-border">
            <span>TEAMTAB PASS</span>
            <span className="text-ml-blue font-bold">ERC-4337</span>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <div>
              <div className="font-display text-xl text-ml-beige uppercase tracking-tight">{scopedKey.memberName}</div>
              <div className="text-[10px] font-mono text-ml-blue uppercase tracking-widest mt-1 border border-ml-blue/30 bg-ml-blue/10 px-2 py-1 inline-block">{scopedKey.category}</div>
            </div>
            <div>
              <div className="text-[9px] font-mono tracking-widest text-ml-beige/40 uppercase mb-1">Total Ceiling</div>
              <div className="font-bold font-mono text-ml-beige text-lg">{scopedKey.ceiling} ETH</div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-ml-border flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-ml-beige/60">
            <span className="truncate pr-4">KEY: {scopedKey.member.slice(0, 12)}...</span>
            <span className="text-ml-pink shrink-0">AUTO-EXPIRES</span>
          </div>
        </div>

        {/* Share Link */}
        <div className="mt-8 flex items-center gap-4">
          <input
            type="text"
            readOnly
            value={passUrl}
            className="w-full px-4 py-3 bg-ml-bg border border-ml-border text-[10px] font-mono text-ml-beige focus:outline-none focus:border-ml-beige transition-colors"
          />
          <button
            onClick={handleCopy}
            className="p-3 bg-ml-blue border border-ml-blue text-ml-bg hover:bg-transparent hover:text-ml-blue transition-colors shrink-0"
            title="Copy Pass Link"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-4 border border-ml-border hover:bg-ml-surface text-[10px] font-mono tracking-widest text-ml-beige uppercase transition-colors"
        >
          Done
        </button>

      </div>
    </div>
  );
}
