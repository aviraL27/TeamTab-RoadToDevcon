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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ml-bg/90 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-ml-bg border border-ml-border p-8 relative shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-ml-surface border border-ml-border hover:bg-ml-beige hover:text-ml-bg text-ml-beige transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-ml-border">
          <div className="w-12 h-12 border border-ml-border flex items-center justify-center bg-ml-pink text-ml-bg">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-display text-ml-beige uppercase tracking-tight">Receipt Proof</h3>
            <p className="text-[10px] font-mono tracking-widest text-ml-beige/60 uppercase mt-1">
              Verifiable proof for spend #{spend.id}.
            </p>
          </div>
        </div>

        {/* Receipt Image */}
        <div className="mt-6 border border-ml-border max-h-56 bg-ml-surface relative overflow-hidden group">
          <img
            src={spend.receiptImage || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600"}
            alt="Receipt Proof"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
          <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-ml-bg border border-ml-border text-[9px] font-mono text-ml-beige uppercase tracking-widest">
            IPFS: {spend.receiptHash.slice(0, 16)}...
          </div>
        </div>

        {/* Details Grid */}
        <div className="mt-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-ml-border bg-ml-surface gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-ml-beige/60">Spender</span>
            <span className="font-bold text-sm text-ml-beige uppercase tracking-widest">{spend.memberName}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-ml-border bg-ml-surface gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-ml-beige/60">Category</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-ml-blue border border-ml-blue/30 px-2 py-1 bg-ml-blue/10">{spend.category}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-ml-border bg-ml-surface gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-ml-beige/60">Purpose</span>
            <span className="text-xs text-ml-beige text-right truncate font-mono uppercase">"{spend.purpose}"</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-ml-border bg-ml-surface gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-ml-beige/60">Total Deducted</span>
            <span className="font-display text-xl text-ml-pink">
              -{spend.amount} ETH
            </span>
          </div>
        </div>

        {/* Tx Hash Link */}
        <div className="mt-8 pt-4 border-t border-ml-border flex items-center justify-between">
          <a
            href={`https://sepolia.etherscan.io/tx/${spend.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-mono uppercase tracking-widest text-ml-beige/60 hover:text-ml-beige flex items-center gap-2 transition-colors"
          >
            <span>View on Etherscan</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={onClose}
            className="px-6 py-3 border border-ml-border hover:bg-ml-surface text-[10px] font-mono uppercase tracking-widest text-ml-beige transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
