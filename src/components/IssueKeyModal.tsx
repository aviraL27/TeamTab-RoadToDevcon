"use client";

import React, { useState } from "react";
import { useTeamTab } from "@/lib/store";
import { CATEGORY_OPTIONS } from "@/lib/mockData";
import { X, Key, Plus, ShieldCheck, Sparkles, User, Wallet, DollarSign } from "lucide-react";

interface IssueKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IssueKeyModal({ isOpen, onClose }: IssueKeyModalProps) {
  const { issueScopedKey } = useTeamTab();

  const [memberName, setMemberName] = useState("");
  const [role, setRole] = useState("AI / ML Hacker");
  const [member, setMember] = useState("");
  const [category, setCategory] = useState("API Credits & Compute");
  const [ceiling, setCeiling] = useState("0.40");
  const [singleTxLimit, setSingleTxLimit] = useState("0.20");
  const [expiryHours, setExpiryHours] = useState(72);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const generateBurnerAddress = () => {
    const randomHex = "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    setMember(randomHex);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await issueScopedKey({
      member,
      memberName,
      role,
      category,
      ceiling,
      singleTxLimit,
      expiryHours,
    });
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ml-bg/90 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-ml-bg border border-ml-border p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-ml-surface border border-ml-border hover:bg-ml-beige hover:text-ml-bg text-ml-beige transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-ml-border">
          <div className="w-12 h-12 border border-ml-border flex items-center justify-center bg-ml-blue text-ml-bg">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-display text-ml-beige uppercase tracking-tight">Issue Key</h3>
            <p className="text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase mt-1">
              Mint a scoped session key.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          
          {/* Member Name */}
          <div>
            <label className="text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase block mb-2">
              Teammate Name
            </label>
            <input
              type="text"
              required
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="e.g. Alice"
              className="w-full px-4 py-3 bg-ml-surface border border-ml-border focus:border-ml-beige text-xs text-ml-beige focus:outline-none transition-colors uppercase font-mono"
            />
          </div>

          {/* Member Address */}
          <div>
            <label className="text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase block mb-2">
              Signer Address (EOA)
            </label>
            <input
              type="text"
              required
              value={memberAddress}
              onChange={(e) => setMemberAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 bg-ml-surface border border-ml-border focus:border-ml-beige text-xs text-ml-beige font-mono focus:outline-none transition-colors"
            />
            <p className="text-[9px] text-ml-beige/40 font-mono mt-2 uppercase">
              This address will sign transactions on behalf of the vault.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Ceiling Amount */}
            <div>
              <label className="text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase block mb-2">
                Total Allowance
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={ceiling}
                  onChange={(e) => setCeiling(e.target.value)}
                  placeholder="0.5"
                  className="w-full px-4 py-3 bg-ml-surface border border-ml-border focus:border-ml-beige text-sm font-mono font-bold text-ml-beige focus:outline-none transition-colors"
                />
                <span className="absolute right-4 top-3.5 text-[10px] font-bold text-ml-beige/60 font-mono">
                  ETH
                </span>
              </div>
            </div>

            {/* Single Tx Limit */}
            <div>
              <label className="text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase block mb-2">
                Per Tx Limit
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={singleLimit}
                  onChange={(e) => setSingleLimit(e.target.value)}
                  placeholder="0.1"
                  className="w-full px-4 py-3 bg-ml-surface border border-ml-border focus:border-ml-beige text-sm font-mono font-bold text-ml-beige focus:outline-none transition-colors"
                />
                <span className="absolute right-4 top-3.5 text-[10px] font-bold text-ml-beige/60 font-mono">
                  ETH
                </span>
              </div>
            </div>
          </div>

          {/* Category Scoping */}
          <div>
            <label className="text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase block mb-2">
              Allowed Spend Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-ml-surface border border-ml-border focus:border-ml-beige text-xs font-mono uppercase tracking-widest text-ml-beige focus:outline-none transition-colors appearance-none"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value} className="bg-ml-bg text-ml-beige">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-4 border-t border-ml-border">
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
              className="px-6 py-3 bg-ml-blue border border-ml-blue text-ml-bg hover:bg-transparent hover:text-ml-blue text-[10px] font-mono uppercase tracking-widest transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Issuing..." : "Issue Session Key"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
