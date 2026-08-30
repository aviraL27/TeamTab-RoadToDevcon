"use client";

import React from "react";
import { TaggedSpend } from "@/lib/types";
import { X, ExternalLink, ShieldCheck, Calendar, User, Tag, FileText, CheckCircle2 } from "lucide-react";

interface ReceiptViewerModalProps {
  spend: TaggedSpend | null;
  onClose: () => void;
}

export function ReceiptViewerModal({ spend, onClose }: ReceiptViewerModalProps) {
  if (!spend) return null;

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
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Expense Receipt & Proof</h3>
            <p className="text-xs text-gray-400">
              Verifiable proof anchored to on-chain tagged spend #{spend.id}.
            </p>
          </div>
        </div>

        {/* Receipt Image */}
        <div className="mt-4 rounded-2xl overflow-hidden border border-gray-800 max-h-56 bg-black relative">
          <img
            src={spend.receiptImage || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600"}
            alt="Receipt Proof"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
            IPFS: {spend.receiptHash.slice(0, 16)}...
          </div>
        </div>

        {/* Details Grid */}
        <div className="mt-4 space-y-2.5 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-950/70 border border-gray-800">
            <span className="text-gray-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Spender:</span>
            </span>
            <span className="font-bold text-white">{spend.memberName}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-950/70 border border-gray-800">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              <span>Category & Item:</span>
            </span>
            <span className="font-semibold text-gray-200">{spend.category}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-950/70 border border-gray-800">
            <span className="text-gray-400">Purpose:</span>
            <span className="text-white max-w-[260px] text-right truncate">"{spend.purpose}"</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-950/70 border border-gray-800">
            <span className="text-gray-400">Total Deducted:</span>
            <span className="font-black text-white font-mono">
              -{spend.amount} ETH <span className="text-gray-400 font-normal">(${(parseFloat(spend.amount) * 3000).toLocaleString()})</span>
            </span>
          </div>
        </div>

        {/* Tx Hash Link */}
        <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between">
          <a
            href={`https://sepolia.etherscan.io/tx/${spend.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
          >
            <span>View on Sepolia Etherscan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
