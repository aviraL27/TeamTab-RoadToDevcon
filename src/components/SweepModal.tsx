"use client";

import React, { useState } from "react";
import { useTeamTab } from "@/lib/store";
import { X, ArrowUpRight, AlertTriangle, ShieldCheck } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-gray-900 border border-gray-700 shadow-2xl p-6 sm:p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-gray-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Sweep Unspent Pot to Lead</h3>
            <p className="text-xs text-gray-400">
              Recover unspent funds from the team tab vault back to team lead.
            </p>
          </div>
        </div>

        {/* Balance Notice */}
        <div className="mt-4 p-4 rounded-2xl bg-gray-950 border border-gray-800 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Available Pot to Sweep:</span>
            <span className="text-base font-black text-white font-mono">{vault.currentBalance} ETH</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            All remaining unspent authority from active member keys will be securely returned.
          </p>
        </div>

        <form onSubmit={handleSweep} className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Reason / Memo
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Hackathon Concluded / Event Ended"
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 focus:border-emerald-500 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || parseFloat(vault.currentBalance) <= 0}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {isSubmitting ? "Sweeping Funds..." : "Confirm Sweep"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
