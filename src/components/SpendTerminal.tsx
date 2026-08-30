"use client";

import React, { useState } from "react";
import { useTeamTab } from "@/lib/store";
import { CATEGORY_OPTIONS } from "@/lib/mockData";
import { 
  Zap, 
  Send, 
  Receipt, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  ShieldCheck, 
  Upload, 
  Image as ImageIcon,
  Building,
  Cpu,
  Coffee,
  Globe
} from "lucide-react";

export function SpendTerminal() {
  const { 
    vault, 
    activeMemberAddress, 
    executeSpend, 
    isPaymasterActive, 
    addToast 
  } = useTeamTab();

  const activeKey = vault.keys.find(
    (k) => k.member.toLowerCase() === activeMemberAddress.toLowerCase()
  ) || vault.keys[0];

  const [recipient, setRecipient] = useState("0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97");
  const [recipientName, setRecipientName] = useState("OpenAI Platform");
  const [category, setCategory] = useState(activeKey ? activeKey.category : "API Credits & Compute");
  const [amount, setAmount] = useState("0.12");
  const [purpose, setPurpose] = useState("GPT-4o Vision & Audio Batch API Token Pack");
  const [receiptImage, setReceiptImage] = useState("https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80");
  
  // Execution lifecycle states
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStep, setExecutionStep] = useState<number>(0);
  const [executionError, setExecutionError] = useState<string | null>(null);

  // Sync category when activeKey changes
  React.useEffect(() => {
    if (activeKey && activeKey.category !== "All") {
      setCategory(activeKey.category);
    }
  }, [activeKey]);

  const quickVendors = [
    { name: "OpenAI API", addr: "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97", cat: "API Credits & Compute", defaultAmount: "0.15", memo: "OpenAI GPT-4o Token Allocation" },
    { name: "MakerLab IoT", addr: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", cat: "Hardware & IoT", defaultAmount: "0.20", memo: "ESP32 microcontrollers & Grove Sensors" },
    { name: "Devcon Cafe", addr: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955", cat: "Food & Energy Drinks", defaultAmount: "0.08", memo: "Midnight Team Food & Energy Drinks" },
    { name: "Vercel / Domain", addr: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f", cat: "Domain & Hosting", defaultAmount: "0.05", memo: "Demo Domain + Pro Cloud Deploy" },
  ];

  const handleSelectVendor = (v: typeof quickVendors[0]) => {
    setRecipient(v.addr);
    setRecipientName(v.name);
    setCategory(v.cat);
    setAmount(v.defaultAmount);
    setPurpose(v.memo);
  };

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    setExecutionError(null);
    setIsExecuting(true);
    setExecutionStep(1); // Building UserOp

    try {
      // Step 1: Build UserOp (Simulated micro-delay for realistic feedback)
      await new Promise((r) => setTimeout(r, 450));
      setExecutionStep(2); // Session Key Signature

      // Step 2: Session Key Signing
      await new Promise((r) => setTimeout(r, 550));
      setExecutionStep(3); // Paymaster Sponsorship & Bundler Execution

      // Step 3: Call Store Execution
      await new Promise((r) => setTimeout(r, 600));
      const res = await executeSpend({
        memberAddress: activeKey.member,
        recipient,
        recipientName,
        amount,
        category,
        purpose,
        receiptImage,
      });

      if (!res.success) {
        setExecutionError(res.error || "Transaction rejected by Smart Vault policy.");
        setIsExecuting(false);
        setExecutionStep(0);
        return;
      }

      setExecutionStep(4); // Confirmed on-chain
      try {
        const confetti = (await import("canvas-confetti")).default;
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (err) {}

      setTimeout(() => {
        setIsExecuting(false);
        setExecutionStep(0);
      }, 1800);

    } catch (err: any) {
      setExecutionError(err?.message || "Execution failed");
      setIsExecuting(false);
      setExecutionStep(0);
    }
  };

  const numAmount = parseFloat(amount) || 0;
  const remainingAllowance = activeKey ? Math.max(0, parseFloat(activeKey.ceiling) - parseFloat(activeKey.spent)) : 0;
  const singleLimit = activeKey ? parseFloat(activeKey.singleTxLimit) : 0;
  const exceedsCeiling = numAmount > remainingAllowance;
  const exceedsSingle = numAmount > singleLimit;
  const isCategoryInvalid = activeKey && activeKey.category !== "All" && activeKey.category !== category;

  return (
    <div className="rounded-3xl bg-gray-900/80 border border-gray-800/80 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400" />
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Member Spending Terminal
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Spend autonomously from the team pot using your scoped session key. Zero personal gas required.
          </p>
        </div>

        {/* Active Key Info Badge */}
        {activeKey && (
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-gray-950/70 border border-cyan-500/30 text-xs">
            <img
              src={activeKey.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
              alt={activeKey.memberName}
              className="w-6 h-6 rounded-full object-cover"
            />
            <div>
              <span className="font-bold text-white">{activeKey.memberName}</span>
              <span className="text-gray-400 text-[11px] block">
                Scoped: <strong className="text-cyan-400">{activeKey.category}</strong> (Rem: {remainingAllowance.toFixed(2)} ETH)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Vendor Shortcuts */}
      <div className="mt-5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-2">
          ⚡ Quick Vendor Presets
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {quickVendors.map((v) => (
            <button
              key={v.name}
              type="button"
              onClick={() => handleSelectVendor(v)}
              className="p-2.5 rounded-xl bg-gray-950/50 hover:bg-gray-850 border border-gray-800 hover:border-emerald-500/40 text-left transition-all text-xs group"
            >
              <div className="font-bold text-white group-hover:text-emerald-300 truncate">{v.name}</div>
              <div className="text-[10px] text-gray-400 truncate">{v.cat}</div>
              <div className="text-[10px] font-mono text-emerald-400 mt-1 font-semibold">{v.defaultAmount} ETH</div>
            </button>
          ))}
        </div>
      </div>

      {/* Spend Form */}
      <form onSubmit={handleExecute} className="mt-6 space-y-4">
        
        {/* Recipient & Merchant */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">
              Merchant / Recipient Name
            </label>
            <input
              type="text"
              required
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. OpenAI, AWS, Devcon Cafe"
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950/70 border border-gray-800 focus:border-emerald-500 text-sm text-white focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">
              Recipient Ethereum Address
            </label>
            <input
              type="text"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950/70 border border-gray-800 focus:border-emerald-500 text-sm font-mono text-white focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Amount & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5 flex items-center justify-between">
              <span>Amount (ETH)</span>
              <span className="text-[11px] text-gray-400 font-mono">
                ≈ ${(numAmount * 3000).toLocaleString()} USD
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.001"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-gray-950/70 border text-sm font-mono font-bold text-white focus:outline-none transition-colors ${
                  exceedsCeiling || exceedsSingle ? "border-rose-500 focus:border-rose-500 text-rose-300" : "border-gray-800 focus:border-emerald-500"
                }`}
              />
              <span className="absolute right-3.5 top-2.5 text-xs font-bold text-gray-400 font-mono">
                ETH
              </span>
            </div>
            
            {/* Warning if amount exceeds single limit or ceiling */}
            {exceedsSingle && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Exceeds single tx cap ({singleLimit} ETH)</span>
              </p>
            )}
            {exceedsCeiling && !exceedsSingle && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Exceeds remaining allowance ({remainingAllowance.toFixed(2)} ETH)</span>
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">
              Expense Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-gray-950/70 border text-sm text-white focus:outline-none transition-colors ${
                isCategoryInvalid ? "border-amber-500 text-amber-300" : "border-gray-800 focus:border-emerald-500"
              }`}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value} className="bg-gray-900 text-white">
                  {c.label}
                </option>
              ))}
            </select>
            {isCategoryInvalid && (
              <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Key is authorized for '{activeKey.category}'. Policy will reject.</span>
              </p>
            )}
          </div>
        </div>

        {/* Purpose Memo */}
        <div>
          <label className="text-xs font-semibold text-gray-300 block mb-1.5">
            Expense Purpose / Memo (Tagged on-chain)
          </label>
          <input
            type="text"
            required
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g. OpenAI GPT-4o API Batch Credits for RAG Pipeline"
            className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950/70 border border-gray-800 focus:border-emerald-500 text-sm text-white focus:outline-none transition-colors"
          />
        </div>

        {/* Gas Sponsorship Breakdown */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white">ERC-4337 Gas Sponsorship</span>
              <span className="text-gray-400 block text-[11px]">
                Network gas fee is 100% sponsored by the TeamTab Paymaster.
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-gray-400 line-through text-[11px] mr-1.5">0.0021 ETH ($6.30)</span>
            <span className="text-emerald-400 font-bold font-mono">0.00 ETH ($0.00)</span>
          </div>
        </div>

        {/* Error Feedback */}
        {executionError && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{executionError}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isExecuting || !activeKey || !activeKey.active}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-gray-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isExecuting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-gray-950" />
              <span>
                {executionStep === 1 && "Building UserOperation..."}
                {executionStep === 2 && "Signing with Scoped Session Key..."}
                {executionStep === 3 && "Paymaster Sponsoring Gas & Submitting..."}
                {executionStep === 4 && "✅ Transaction Confirmed on Vault!"}
              </span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>⚡ Execute Gasless Spend ({amount} ETH)</span>
            </>
          )}
        </button>

      </form>

    </div>
  );
}
