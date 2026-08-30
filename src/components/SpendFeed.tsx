"use client";

import React, { useState } from "react";
import { useTeamTab } from "@/lib/store";
import { TaggedSpend } from "@/lib/types";
import { CATEGORY_OPTIONS } from "@/lib/mockData";
import { 
  Receipt, 
  Search, 
  Download, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  Filter,
  CheckCircle2
} from "lucide-react";

interface SpendFeedProps {
  onOpenReceipt: (spend: TaggedSpend) => void;
}

export function SpendFeed({ onOpenReceipt }: SpendFeedProps) {
  const { vault } = useTeamTab();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const getCategoryColor = (cat: string) => {
    const found = CATEGORY_OPTIONS.find((c) => c.value === cat);
    return found ? found.color : "text-gray-300 border-gray-700 bg-gray-800";
  };

  const filteredSpends = vault.spends.filter((s) => {
    const matchesSearch =
      s.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.recipientName && s.recipientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const exportCSV = () => {
    const headers = ["ID", "Member", "Recipient", "Amount (ETH)", "Category", "Purpose", "Receipt Hash", "Tx Hash", "Timestamp"];
    const rows = vault.spends.map((s) => [
      s.id,
      s.memberName,
      s.recipientName || s.recipient,
      s.amount,
      s.category,
      `"${s.purpose.replace(/"/g, '""')}"`,
      s.receiptHash,
      s.txHash,
      new Date(s.timestamp).toISOString(),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `TeamTab_Expense_Report_${vault.teamName.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-3xl bg-gray-900/80 border border-gray-800/80 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
      
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Live Spending Tab & Audit Trail
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Real-time on-chain stream of every tagged team expenditure with verifiable receipt proofs.
          </p>
        </div>

        {/* Export CSV Button */}
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 text-gray-200 text-xs font-semibold transition-colors shrink-0"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Expense Report</span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by teammate, merchant, or purpose..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-950/70 border border-gray-800 focus:border-emerald-500 text-xs text-white focus:outline-none transition-colors"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              selectedCategory === "All"
                ? "bg-emerald-500 text-gray-950 font-bold"
                : "bg-gray-950/60 hover:bg-gray-800 text-gray-400 border border-gray-800"
            }`}
          >
            All Categories ({vault.spends.length})
          </button>
          {CATEGORY_OPTIONS.filter((c) => c.value !== "All").map((c) => {
            const count = vault.spends.filter((s) => s.category === c.value).length;
            if (count === 0) return null;
            return (
              <button
                key={c.value}
                onClick={() => setSelectedCategory(c.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === c.value
                    ? "bg-emerald-500 text-gray-950 font-bold"
                    : "bg-gray-950/60 hover:bg-gray-800 text-gray-400 border border-gray-800"
                }`}
              >
                {c.value.split(" ")[0]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Spends List */}
      <div className="mt-5 space-y-3">
        {filteredSpends.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-gray-950/40 border border-gray-800/60 text-gray-400 text-xs">
            No spending transactions found matching your criteria.
          </div>
        ) : (
          filteredSpends.map((spend) => {
            const catColor = getCategoryColor(spend.category);
            const timeAgo = formatTimeAgo(spend.timestamp);

            return (
              <div
                key={spend.id}
                className="p-4 sm:p-5 rounded-2xl bg-gray-950/60 border border-gray-800/80 hover:border-gray-700/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left: Spender & Purpose Info */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-sm text-emerald-400 shrink-0">
                    {spend.memberName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-white">{spend.memberName}</span>
                      <span className="text-gray-400 text-xs">paid</span>
                      <span className="font-semibold text-xs text-gray-200">{spend.recipientName || "Merchant"}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${catColor}`}>
                        {spend.category}
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                      "{spend.purpose}"
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400 font-mono flex-wrap">
                      <span>{timeAgo}</span>
                      <span>•</span>
                      <span className="text-emerald-400/90 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        Gas Sponsored
                      </span>
                      <span>•</span>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${spend.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-emerald-400 inline-flex items-center gap-1"
                      >
                        <span>Tx: {spend.txHash.slice(0, 8)}...</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Receipt Button */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-800/60">
                  <div className="text-right">
                    <div className="text-base sm:text-lg font-black text-white font-mono">
                      -{spend.amount} <span className="text-xs text-emerald-400">ETH</span>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      ≈ ${spend.amountUSD.toLocaleString()} USD
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenReceipt(spend)}
                    className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white text-xs transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View Receipt</span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

function formatTimeAgo(timestamp: number) {
  const diff = Math.max(0, Date.now() - timestamp);
  const hours = Math.floor(diff / (3600 * 1000));
  if (hours < 1) return "Just now";
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}
