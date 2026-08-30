"use client";

import React, { useState } from "react";
import { useTeamTab } from "@/lib/store";
import { 
  ShieldCheck, 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  Sparkles, 
  Layers, 
  Lock,
  ArrowRight,
  Terminal
} from "lucide-react";

export function AAPolicyInspector() {
  const { runPolicyTest } = useTeamTab();
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    reason: string;
    gasSponsored: boolean;
    ruleEvaluated: string;
  } | null>(null);

  const handleRunTest = async (type: "valid" | "over_ceiling" | "exceed_single" | "wrong_category" | "expired_key") => {
    setActiveTest(type);
    setIsRunning(true);
    setTestResult(null);

    // Simulate smart account verification latency
    await new Promise((r) => setTimeout(r, 600));

    const res = await runPolicyTest(type);
    setTestResult(res);
    setIsRunning(false);
  };

  const testCases = [
    {
      id: "valid",
      title: "1. Authorized Category & Limit Spend",
      description: "0.05 ETH spend for 'API Credits' within single cap and ceiling.",
      expected: "PASS (Smart Account Executes + Paymaster Gas Sponsoring)",
      badgeColor: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    },
    {
      id: "over_ceiling",
      title: "2. Exceeding Cumulative Ceiling Test",
      description: "Attempting to spend 0.90 ETH when remaining allowance is 0.18 ETH.",
      expected: "REVERT on-chain: ExceedsBudgetCeiling",
      badgeColor: "border-rose-500/30 text-rose-400 bg-rose-500/10",
    },
    {
      id: "exceed_single",
      title: "3. Single Transaction Limit Test",
      description: "Attempting 0.35 ETH in a single spend (Single cap is 0.20 ETH).",
      expected: "REVERT on-chain: ExceedsSingleTxLimit",
      badgeColor: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    },
    {
      id: "wrong_category",
      title: "4. Category Scope Restriction Test",
      description: "Member scoped to 'API Credits' attempts to spend on 'Food & Drinks'.",
      expected: "REVERT on-chain: CategoryMismatch",
      badgeColor: "border-purple-500/30 text-purple-400 bg-purple-500/10",
    },
    {
      id: "expired_key",
      title: "5. Post-Event Key Expiration Test",
      description: "Attempting to spend after the hackathon end timestamp.",
      expected: "REVERT on-chain: KeyExpired / EventAlreadyEnded",
      badgeColor: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
    },
  ];

  return (
    <div className="bg-ml-bg border border-ml-border p-8 sm:p-12 relative overflow-hidden mt-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-ml-border">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-ml-border flex items-center justify-center bg-ml-pink text-ml-bg">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xl sm:text-2xl font-display text-ml-beige uppercase tracking-tight mt-1">
              Policy Sandbox
            </h3>
          </div>
          <p className="text-[10px] font-mono tracking-widest text-ml-beige/60 mt-3 uppercase">
            Test how Account Abstraction session keys enforce rules.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 border border-ml-beige text-[9px] font-mono tracking-widest uppercase text-ml-beige">
          <Terminal className="w-3 h-3" />
          <span>Interactive Verification Engine</span>
        </div>
      </div>

      {/* Architecture Visual Diagram */}
      <div className="mt-8 p-6 border border-ml-border bg-ml-surface">
        <div className="text-[10px] uppercase tracking-widest font-mono text-ml-beige/60 mb-6 flex items-center gap-2">
          <Layers className="w-4 h-4 text-ml-beige" />
          <span>TeamTab ERC-4337 Pipeline</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center text-[9px] font-mono tracking-widest uppercase">
          <div className="p-4 border border-ml-border bg-ml-bg hover:border-ml-blue transition-colors group">
            <div className="text-ml-blue font-bold group-hover:scale-105 transition-transform">1. Session Key</div>
            <div className="text-ml-beige/40 mt-2">Off-Chain</div>
          </div>
          <div className="p-4 border border-ml-border bg-ml-bg hover:border-ml-green transition-colors group">
            <div className="text-ml-green font-bold group-hover:scale-105 transition-transform">2. UserOp</div>
            <div className="text-ml-beige/40 mt-2">EIP-712</div>
          </div>
          <div className="p-4 border border-ml-border bg-ml-bg hover:border-ml-yellow transition-colors group">
            <div className="text-ml-yellow font-bold group-hover:scale-105 transition-transform">3. Paymaster</div>
            <div className="text-ml-beige/40 mt-2">Sponsorship</div>
          </div>
          <div className="p-4 border border-ml-border bg-ml-bg hover:border-ml-pink transition-colors group">
            <div className="text-ml-pink font-bold group-hover:scale-105 transition-transform">4. Bundler</div>
            <div className="text-ml-beige/40 mt-2">Batching</div>
          </div>
          <div className="p-4 border border-ml-beige bg-ml-bg col-span-2 sm:col-span-1 shadow-[4px_4px_0_0_#EAE7DD]">
            <div className="text-ml-beige font-bold">5. Vault</div>
            <div className="text-ml-beige/60 mt-2">Execution</div>
          </div>
        </div>
      </div>

      {/* Test Scenarios Grid */}
      <div className="grid grid-cols-1 gap-4 mt-8">
        {testCases.map((tc) => {
          const isSelected = activeTest === tc.id;
          return (
            <div
              key={tc.id}
              className={`p-6 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${
                isSelected ? "bg-ml-surface border-ml-beige" : "bg-ml-bg border-ml-border hover:border-ml-beige/50"
              }`}
            >
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-sm text-ml-beige uppercase tracking-widest">{tc.title}</span>
                  <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-1 border ${tc.badgeColor}`}>
                    {tc.expected}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-ml-beige/60 mt-2 uppercase">{tc.description}</p>
              </div>

              <button
                onClick={() => handleRunTest(tc.id as any)}
                disabled={isRunning}
                className="flex items-center gap-2 px-6 py-3 border border-ml-border hover:bg-ml-beige hover:text-ml-bg text-[10px] font-mono tracking-widest text-ml-beige uppercase transition-colors shrink-0 disabled:opacity-50"
              >
                {isRunning && isSelected ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Play className="w-3 h-3" />
                )}
                <span>Evaluate</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Live Result Terminal */}
      {testResult && (
        <div className="mt-8 p-6 border border-ml-beige bg-ml-surface font-mono text-xs animate-in fade-in relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-ml-beige" />
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-ml-border">
            <span className="text-ml-beige/60 flex items-center gap-2 uppercase tracking-widest">
              <Terminal className="w-4 h-4 text-ml-beige" />
              <span>Smart Account Verdict</span>
            </span>
            <span
              className={`px-3 py-1.5 border text-[9px] font-bold uppercase tracking-widest ${
                testResult.success ? "border-ml-green text-ml-green bg-ml-green/10" : "border-ml-pink text-ml-pink bg-ml-pink/10"
              }`}
            >
              {testResult.success ? "EXECUTION SUCCESS" : "POLICY REVERT"}
            </span>
          </div>

          <div className="space-y-3 text-[10px] uppercase tracking-widest">
            <div className="grid grid-cols-[150px_1fr] gap-4">
              <span className="text-ml-beige/40">Rule Evaluated</span>
              <span className="text-ml-blue">{testResult.ruleEvaluated}</span>
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-4">
              <span className="text-ml-beige/40">Result</span>
              <span className={testResult.success ? "text-ml-green" : "text-ml-pink"}>
                {testResult.reason}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-4">
              <span className="text-ml-beige/40">Gas Sponsorship</span>
              <span className="text-ml-beige font-bold">
                {testResult.gasSponsored ? "Covered by Paymaster" : "N/A (Reverted)"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
