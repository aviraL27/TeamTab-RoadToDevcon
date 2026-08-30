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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-gray-900 border border-gray-700 shadow-2xl p-6 sm:p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-gray-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Issue Scoped Session Key</h3>
            <p className="text-xs text-gray-400">
              Grant a teammate programmable spending authority from the team pot.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* Member Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Teammate Name
              </label>
              <input
                type="text"
                required
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="e.g. Sam Altman"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 focus:border-emerald-500 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Team Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. ML & Compute Hacker"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 focus:border-emerald-500 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Member Address / Auto-Gen Burner */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-300">
                Signer Ethereum Address
              </label>
              <button
                type="button"
                onClick={generateBurnerAddress}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto-Generate Key</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={member}
              onChange={(e) => setMember(e.target.value)}
              placeholder="0x... or click Auto-Generate"
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 focus:border-emerald-500 text-xs font-mono text-white focus:outline-none"
            />
          </div>

          {/* Category Scope */}
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Scoped Spending Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 focus:border-emerald-500 text-xs text-white focus:outline-none"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value} className="bg-gray-900 text-white">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Ceiling & Single Tx Limit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Budget Ceiling (ETH)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={ceiling}
                onChange={(e) => setCeiling(e.target.value)}
                placeholder="0.50"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 focus:border-emerald-500 text-xs font-mono text-white focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Single Tx Cap (ETH)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={singleTxLimit}
                onChange={(e) => setSingleTxLimit(e.target.value)}
                placeholder="0.20"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 focus:border-emerald-500 text-xs font-mono text-white focus:outline-none font-bold"
              />
            </div>
          </div>

          {/* Expiry Duration */}
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Authority Duration (Hours)
            </label>
            <input
              type="number"
              min="1"
              max="720"
              value={expiryHours}
              onChange={(e) => setExpiryHours(parseInt(e.target.value) || 72)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 focus:border-emerald-500 text-xs font-mono text-white focus:outline-none"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Key will automatically expire after {expiryHours} hours (event conclusion).
            </p>
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
              {isSubmitting ? "Registering on Vault..." : "Issue Session Key"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
