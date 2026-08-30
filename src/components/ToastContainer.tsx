"use client";

import React from "react";
import { useTeamTab } from "@/lib/store";
import { CheckCircle2, AlertTriangle, XCircle, Info, X, ExternalLink } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useTeamTab();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
          error: <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
          info: <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />,
        };

        const borders = {
          success: "border-emerald-500/30 bg-emerald-950/80 shadow-emerald-950/50",
          error: "border-rose-500/30 bg-rose-950/80 shadow-rose-950/50",
          warning: "border-amber-500/30 bg-amber-950/80 shadow-amber-950/50",
          info: "border-cyan-500/30 bg-cyan-950/80 shadow-cyan-950/50",
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border backdrop-blur-xl shadow-xl flex items-start gap-3 transition-all duration-300 transform translate-y-0 ${borders[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white leading-tight">{toast.title}</h4>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">{toast.description}</p>
              {toast.txHash && (
                <a
                  href={`https://sepolia.etherscan.io/tx/${toast.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 mt-2 font-mono"
                >
                  <span>Tx: {toast.txHash.slice(0, 10)}...{toast.txHash.slice(-8)}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
