"use client";

import React, { useState } from "react";
import { useTeamTab } from "@/lib/store";
import { X, ArrowDownLeft, Coins, Sparkles } from "lucide-react";

interface FundVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FundVaultModal({ isOpen, onClose }: FundVaultModalProps) {
  const { fundTab, vault } = useTeamTab();
  const [amount, setAmount] = useState("1.0");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const quickPots = ["0.5", "1.0", "2.5", "5.0"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await fundTab(amount);
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

        {/* Header */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-gray-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Deposit into Team Pot</h3>
            <p className="text-xs text-gray-400">
              Add shared funds to "{vault.teamName}" vault.
            </p>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="mt-5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-2">
            Quick Preset Amounts
          </label>
          <div className="grid grid-cols-4 gap-2">
            {quickPots.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  amount === preset
                    ? "bg-emerald-500 text-gray-950 shadow-md shadow-emerald-500/20"
                    : "bg-gray-950 border border-gray-800 text-gray-300 hover:border-gray-700"
                }`}
              >
                +{preset} ETH
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Deposit Amount (ETH)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1.0"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 focus:border-emerald-500 text-sm font-mono font-bold text-white focus:outline-none"
              />
              <span className="absolute right-3.5 top-2.5 text-xs font-bold text-gray-400 font-mono">
                ETH
              </span>
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              ≈ ${(parseFloat(amount || "0") * 3000).toLocaleString()} USD
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-gray-950 font-bold text-xs shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {isSubmitting ? "Depositing..." : "Confirm Deposit"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
