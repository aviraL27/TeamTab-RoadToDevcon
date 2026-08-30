"use client";

import React, { useState } from "react";
import { useTeamTab } from "@/lib/store";
import { X, ArrowUpRight, AlertTriangle, ShieldCheck, Loader2 } from "lucide-react";

interface SweepModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SweepModal({ isOpen, onClose }: SweepModalProps) {
  const { vault, sweepRemainingPot } = useTeamTab();
  const [reason, setReason] = useState("Hackathon Concluded");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSweep = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await sweepRemainingPot(reason);
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ml-bg/90 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-ml-bg border border-ml-border p-8 relative shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-ml-surface border border-ml-border hover:bg-ml-beige hover:text-ml-bg text-ml-beige transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-ml-border">
          <div className="w-12 h-12 border border-ml-border flex items-center justify-center bg-ml-pink text-ml-bg">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-display text-ml-beige uppercase tracking-tight">Sweep Pot</h3>
            <p className="text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase mt-1">
              Reclaim unspent funds.
            </p>
          </div>
        </div>

        {/* Context Info */}
        <div className="mt-6 p-4 border border-ml-pink bg-ml-pink/5 space-y-4">
          <div className="flex items-start gap-3 text-[10px] font-mono uppercase tracking-widest text-ml-pink">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">End of Event / Revoke All</p>
              <p className="opacity-80 mt-1">
                This action will sweep the remaining balance of <strong className="font-display text-xs">{vault.currentBalance} ETH</strong> back to your address.
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-ml-pink/20">
            <label className="text-[10px] font-mono tracking-widest text-ml-pink/60 uppercase block mb-1">
              Destination Address
            </label>
            <div className="font-mono text-xs text-ml-pink break-all">
              {vault.lead}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 pt-4 flex items-center justify-end gap-4 border-t border-ml-border">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-3 border border-ml-border hover:bg-ml-surface text-[10px] font-mono uppercase tracking-widest text-ml-beige transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSweep}
            disabled={isSubmitting}
            className="px-6 py-3 bg-ml-pink border border-ml-pink text-ml-bg hover:bg-transparent hover:text-ml-pink text-[10px] font-mono uppercase tracking-widest transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sweeping...</span>
              </>
            ) : (
              <span>Sweep {vault.currentBalance} ETH</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
