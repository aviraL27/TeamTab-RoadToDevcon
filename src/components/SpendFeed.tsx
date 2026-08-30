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
  CheckCircle2,
  User
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
    <div className="bg-ml-bg border border-ml-border p-8 sm:p-12 relative overflow-hidden">
      
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-ml-border">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-ml-border flex items-center justify-center bg-ml-green text-ml-bg">
              <Receipt className="w-4 h-4" />
            </div>
            <h3 className="text-xl sm:text-2xl font-display text-ml-beige uppercase tracking-tight mt-1">
              Live Feed
            </h3>
          </div>
          <p className="text-[10px] font-mono tracking-widest text-ml-beige/60 mt-3 uppercase">
            Real-time feed of all team spends.
          </p>
        </div>

        {/* Export CSV Button */}
        <button
          onClick={exportCSV}
          className="ml-button flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ml-beige/40 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by name, vendor..."
            className="w-full pl-9 pr-4 py-3 bg-ml-surface border border-ml-border focus:border-ml-beige text-xs text-ml-beige font-mono uppercase focus:outline-none transition-colors"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-3 border text-[10px] font-mono uppercase tracking-widest transition-colors whitespace-nowrap ${
              selectedCategory === "All"
                ? "bg-ml-beige text-ml-bg border-ml-beige"
                : "bg-ml-surface text-ml-beige/60 border-ml-border hover:border-ml-beige hover:text-ml-beige"
            }`}
          >
            All ({vault.spends.length})
          </button>
          {CATEGORY_OPTIONS.filter((c) => c.value !== "All").map((c) => {
            const count = vault.spends.filter((s) => s.category === c.value).length;
            if (count === 0) return null;
            return (
              <button
                key={c.value}
                onClick={() => setSelectedCategory(c.value)}
                className={`px-4 py-3 border text-[10px] font-mono uppercase tracking-widest transition-colors whitespace-nowrap ${
                  selectedCategory === c.value
                    ? "bg-ml-beige text-ml-bg border-ml-beige"
                    : "bg-ml-surface text-ml-beige/60 border-ml-border hover:border-ml-beige hover:text-ml-beige"
                }`}
              >
                {c.value.split(" ")[0]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Spends List */}
      <div className="mt-8 space-y-4">
        {filteredSpends.length === 0 ? (
          <div className="text-center py-12 border border-ml-border border-dashed text-ml-beige/40 text-[10px] font-mono uppercase tracking-widest">
            {searchQuery ? "No spends found for filter." : "No team spends yet."}
          </div>
        ) : (
          filteredSpends.map((spend) => {
            const timeAgo = formatTimeAgo(spend.timestamp);

            return (
              <div
                key={spend.id}
                className="p-4 sm:p-6 border border-ml-border bg-ml-surface hover:border-ml-beige transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                {/* Left: Spender & Purpose Info */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-ml-border flex items-center justify-center bg-ml-bg text-ml-beige shrink-0 group-hover:scale-105 transition-transform">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ml-beige uppercase tracking-widest text-xs">
                        {spend.memberName}
                      </span>
                      <span className="text-[10px] text-ml-beige/60 font-mono">paid</span>
                      <span className="font-bold text-ml-beige text-xs truncate max-w-[120px] uppercase">
                        {spend.recipientName || "Merchant"}
                      </span>
                      <span className="text-[9px] text-ml-blue border border-ml-blue/30 px-1 py-0.5 ml-2 uppercase font-mono tracking-widest">
                        {spend.category}
                      </span>
                    </div>

                    <p className="text-[10px] text-ml-beige/60 mt-1 font-mono uppercase">
                      "{spend.purpose}"
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[9px] font-mono tracking-widest uppercase text-ml-beige/40">
                      <span>{timeAgo}</span>
                      <span>•</span>
                      <span className="text-ml-green flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-ml-green" />
                        Gas Sponsored
                      </span>
                      <span>•</span>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${spend.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-ml-beige inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Tx: {spend.txHash.slice(0, 8)}...</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Receipt Button */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-ml-border w-full sm:w-auto">
                  <div className="text-right">
                    <div className="text-xl font-display text-ml-beige group-hover:text-ml-pink transition-colors">
                      -{spend.amount} ETH
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenReceipt(spend)}
                    className="mt-2 flex items-center gap-2 px-3 py-1.5 border border-ml-border hover:bg-ml-beige hover:text-ml-bg text-ml-beige/80 text-[9px] font-mono uppercase tracking-widest transition-colors"
                  >
                    <FileText className="w-3 h-3" />
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
