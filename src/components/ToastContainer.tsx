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
        const icons: Record<string, React.ReactNode> = {
          success: <CheckCircle2 className="w-4 h-4 shrink-0" />,
          error: <XCircle className="w-4 h-4 shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 shrink-0" />,
          info: <Info className="w-4 h-4 shrink-0" />,
        };

        const theme: Record<string, string> = {
          success: "border-ml-green text-ml-green bg-ml-green/10",
          error: "border-ml-pink text-ml-pink bg-ml-pink/10",
          warning: "border-ml-yellow text-ml-yellow bg-ml-yellow/10",
          info: "border-ml-blue text-ml-blue bg-ml-blue/10",
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 border bg-ml-bg shadow-[4px_4px_0_0_#0a0a0a] flex items-start gap-3 transition-all duration-300 ${theme[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0 pt-0.5">
              <h4 className="text-[10px] font-bold uppercase tracking-widest leading-tight">{toast.title}</h4>
              <p className="text-[10px] font-mono opacity-80 mt-1 uppercase tracking-widest">{toast.description}</p>
              {toast.txHash && (
                <a
                  href={`https://sepolia.etherscan.io/tx/${toast.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[9px] font-mono tracking-widest mt-3 hover:opacity-70 transition-opacity uppercase"
                >
                  <span>Tx: {toast.txHash.slice(0, 10)}...{toast.txHash.slice(-8)}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:opacity-70 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
