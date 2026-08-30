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
    <div className="bg-ml-bg border border-ml-border p-8 sm:p-12 relative overflow-hidden">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-ml-border">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-ml-border flex items-center justify-center bg-ml-pink text-ml-bg">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <h3 className="text-xl sm:text-2xl font-display text-ml-beige uppercase tracking-tight mt-1">
              Terminal
            </h3>
          </div>
          <p className="text-[10px] font-mono tracking-widest text-ml-beige/60 mt-3 uppercase">
            Execute gasless spends via AA session key.
          </p>
        </div>

        {/* Active Key Info Badge */}
        {activeKey && (
          <div className="flex items-center gap-4 px-4 py-3 border border-ml-border bg-ml-surface">
            <img
              src={activeKey.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
              alt={activeKey.memberName}
              className="w-10 h-10 border border-ml-border object-cover grayscale opacity-80"
            />
            <div>
              <span className="font-bold text-ml-beige text-xs uppercase tracking-widest">{activeKey.memberName}</span>
              <span className="text-ml-beige/60 text-[10px] font-mono uppercase block mt-1">
                Scoped: <strong className="text-ml-blue">{activeKey.category}</strong> (Rem: {remainingAllowance.toFixed(2)} ETH)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Vendor Shortcuts */}
      <div className="mt-8">
        <label className="text-[10px] font-mono uppercase tracking-widest text-ml-beige/60 block mb-4">
          Quick Presets
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickVendors.map((v) => (
            <button
              key={v.name}
              type="button"
              onClick={() => handleSelectVendor(v)}
              className="p-4 border border-ml-border bg-ml-surface hover:border-ml-beige transition-all text-left group"
            >
              <div className="font-bold text-ml-beige text-xs uppercase tracking-widest group-hover:text-ml-pink truncate">{v.name}</div>
              <div className="text-[10px] text-ml-beige/50 font-mono truncate mt-2">{v.cat}</div>
              <div className="text-[10px] font-mono text-ml-green mt-2 pt-2 border-t border-ml-border">{v.defaultAmount} ETH</div>
            </button>
          ))}
        </div>
      </div>

      {/* Spend Form */}
      <form onSubmit={handleExecute} className="mt-8 space-y-6">
        
        {/* Recipient & Merchant */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase block mb-2">
              Merchant Name
            </label>
            <input
              type="text"
              required
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. OpenAI, AWS"
              className="w-full px-4 py-3 bg-ml-surface border border-ml-border focus:border-ml-beige text-xs text-ml-beige focus:outline-none transition-colors font-mono uppercase"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase block mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 bg-ml-surface border border-ml-border focus:border-ml-beige text-xs text-ml-beige focus:outline-none transition-colors font-mono"
            />
          </div>
        </div>

        {/* Amount & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase block mb-2 flex items-center justify-between">
              <span>Amount (ETH)</span>
              <span>
                ≈ ${(numAmount * 3000).toLocaleString()}
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
                className={`w-full px-4 py-3 bg-ml-surface border text-sm font-mono font-bold text-ml-beige focus:outline-none transition-colors ${
                  exceedsCeiling || exceedsSingle ? "border-ml-pink text-ml-pink" : "border-ml-border focus:border-ml-beige"
                }`}
              />
              <span className="absolute right-4 top-3.5 text-[10px] font-bold text-ml-beige/60 font-mono">
                ETH
              </span>
            </div>
            
            {/* Warning if amount exceeds single limit or ceiling */}
            {exceedsSingle && (
              <p className="text-[10px] text-ml-pink mt-2 font-mono uppercase flex items-center gap-2">
                <AlertCircle className="w-3 h-3" />
                <span>Exceeds cap ({singleLimit} ETH)</span>
              </p>
            )}
            {exceedsCeiling && !exceedsSingle && (
              <p className="text-[10px] text-ml-pink mt-2 font-mono uppercase flex items-center gap-2">
                <AlertCircle className="w-3 h-3" />
                <span>Exceeds allowance ({remainingAllowance.toFixed(2)} ETH)</span>
              </p>
            )}
          </div>

          <div>
            <label className="text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase block mb-2">
              Expense Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-4 py-3 bg-ml-surface border text-xs font-mono uppercase tracking-widest text-ml-beige focus:outline-none transition-colors appearance-none ${
                isCategoryInvalid ? "border-ml-yellow text-ml-yellow" : "border-ml-border focus:border-ml-beige"
              }`}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value} className="bg-ml-bg text-ml-beige">
                  {c.label}
                </option>
              ))}
            </select>
            {isCategoryInvalid && (
              <p className="text-[10px] text-ml-yellow mt-2 font-mono uppercase flex items-center gap-2">
                <AlertCircle className="w-3 h-3" />
                <span>Key authorized for '{activeKey.category}'.</span>
              </p>
            )}
          </div>
        </div>

        {/* Purpose Memo */}
        <div>
          <label className="text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase block mb-2">
            Expense Purpose
          </label>
          <input
            type="text"
            required
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g. Batch Credits for RAG Pipeline"
            className="w-full px-4 py-3 bg-ml-surface border border-ml-border focus:border-ml-beige text-xs text-ml-beige font-mono focus:outline-none transition-colors uppercase"
          />
        </div>

        {/* Gas Sponsorship Breakdown */}
        <div className="p-4 border border-ml-green bg-ml-green/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-ml-green shrink-0" />
            <div>
              <span className="font-bold text-ml-green uppercase">Sponsorship</span>
              <span className="text-ml-beige/60 block text-[10px] uppercase mt-1">
                Gas paid by Paymaster
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-ml-beige/40 line-through text-[10px] mr-2">0.0021 ETH</span>
            <span className="text-ml-green font-bold bg-ml-green/20 px-2 py-1">0.00 ETH</span>
          </div>
        </div>

        {/* Error Feedback */}
        {executionError && (
          <div className="p-4 bg-ml-pink/10 border border-ml-pink text-ml-pink text-[10px] font-mono uppercase flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{executionError}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isExecuting || !activeKey || !activeKey.active}
          className="w-full py-5 bg-ml-bg border border-ml-border hover:bg-ml-surface hover:border-ml-beige text-ml-beige font-display text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isExecuting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-ml-beige" />
              <span>
                {executionStep === 1 && "Building UserOp..."}
                {executionStep === 2 && "Signing..."}
                {executionStep === 3 && "Sponsoring..."}
                {executionStep === 4 && "Confirmed!"}
              </span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <span>Execute Spend ({amount} ETH)</span>
            </>
          )}
        </button>

      </form>

    </div>
  );
}
