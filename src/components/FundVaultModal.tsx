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
          <div className="w-12 h-12 border border-ml-border flex items-center justify-center bg-ml-green text-ml-bg">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-display text-ml-beige uppercase tracking-tight">Deposit Pot</h3>
            <p className="text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase mt-1">
              Add funds to {vault.teamName}.
            </p>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="mt-6">
          <label className="text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase block mb-3">
            Quick Presets
          </label>
          <div className="grid grid-cols-4 gap-2">
            {quickPots.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                className={`py-3 border text-xs font-mono font-bold transition-all ${
                  amount === preset
                    ? "bg-ml-green border-ml-green text-ml-bg"
                    : "bg-ml-surface border-ml-border text-ml-beige hover:border-ml-beige"
                }`}
              >
                +{preset}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label className="text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase block mb-2">
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
                className="w-full px-4 py-3 bg-ml-surface border border-ml-border focus:border-ml-beige text-sm font-mono font-bold text-ml-beige focus:outline-none transition-colors"
              />
              <span className="absolute right-4 top-3.5 text-[10px] font-bold text-ml-beige/60 font-mono">
                ETH
              </span>
            </div>
            <div className="text-[10px] font-mono tracking-widest text-ml-beige/60 mt-2">
              ≈ ${(parseFloat(amount || "0") * 3000).toLocaleString()} USD
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-ml-border hover:bg-ml-surface text-[10px] font-mono uppercase tracking-widest text-ml-beige transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-ml-green border border-ml-green text-ml-bg hover:bg-transparent hover:text-ml-green text-[10px] font-mono uppercase tracking-widest transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Depositing..." : "Confirm Deposit"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
