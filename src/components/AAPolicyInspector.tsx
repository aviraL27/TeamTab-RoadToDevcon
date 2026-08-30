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
    <div className="rounded-3xl bg-gray-900/80 border border-gray-800/80 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg sm:text-xl font-bold text-white">
              ERC-4337 Policy Sandbox & Security Inspector
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Test how Account Abstraction session keys programmatically enforce spending rules at the smart contract level.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-mono">
          <Terminal className="w-3.5 h-3.5" />
          <span>Interactive Verification Engine</span>
        </div>
      </div>

      {/* Architecture Visual Diagram */}
      <div className="mt-6 p-4 rounded-2xl bg-gray-950/70 border border-gray-800 text-xs">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 mb-3 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>TeamTab ERC-4337 Execution Pipeline</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px] font-mono">
          <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800">
            <div className="text-emerald-400 font-bold">1. Session Key</div>
            <div className="text-gray-400 text-[10px] mt-0.5">Off-Chain Signer</div>
          </div>
          <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800">
            <div className="text-cyan-400 font-bold">2. UserOp</div>
            <div className="text-gray-400 text-[10px] mt-0.5">EIP-712 Envelope</div>
          </div>
          <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800">
            <div className="text-purple-400 font-bold">3. Paymaster</div>
            <div className="text-gray-400 text-[10px] mt-0.5">Gas Sponsorship</div>
          </div>
          <div className="p-2.5 rounded-xl bg-gray-900 border border-gray-800">
            <div className="text-amber-400 font-bold">4. Bundler</div>
            <div className="text-gray-400 text-[10px] mt-0.5">EntryPoint Batch</div>
          </div>
          <div className="p-2.5 rounded-xl bg-gray-900 border border-emerald-500/40 col-span-2 sm:col-span-1">
            <div className="text-white font-bold">5. Team Vault</div>
            <div className="text-emerald-400 text-[10px] mt-0.5">Policy Execution</div>
          </div>
        </div>
      </div>

      {/* Test Scenarios Grid */}
      <div className="grid grid-cols-1 gap-3 mt-6">
        {testCases.map((tc) => {
          const isSelected = activeTest === tc.id;
          return (
            <div
              key={tc.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isSelected ? "bg-gray-950 border-cyan-500/50" : "bg-gray-950/40 border-gray-800/80 hover:border-gray-700"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-white">{tc.title}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${tc.badgeColor}`}>
                    {tc.expected}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{tc.description}</p>
              </div>

              <button
                onClick={() => handleRunTest(tc.id as any)}
                disabled={isRunning}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs font-bold text-gray-200 hover:text-white transition-colors shrink-0 disabled:opacity-50"
              >
                {isRunning && isSelected ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                )}
                <span>Evaluate On-Chain</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Live Result Terminal */}
      {testResult && (
        <div className="mt-6 p-4 rounded-2xl bg-gray-950 border border-gray-800 font-mono text-xs animate-in fade-in">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-800">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Smart Account Execution Verdict</span>
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                testResult.success ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
              }`}
            >
              {testResult.success ? "EXECUTION SUCCESS" : "POLICY REVERT"}
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div>
              <span className="text-gray-500">Rule Evaluated: </span>
              <span className="text-cyan-300">{testResult.ruleEvaluated}</span>
            </div>
            <div>
              <span className="text-gray-500">Result: </span>
              <span className={testResult.success ? "text-emerald-300" : "text-rose-300"}>
                {testResult.reason}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Gas Sponsorship: </span>
              <span className="text-emerald-400 font-bold">
                {testResult.gasSponsored ? "Covered by Paymaster ($0 cost to signer)" : "N/A (Reverted prior to state change)"}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
