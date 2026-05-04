"use client";

import { CheckCircle2, X } from "lucide-react";

interface PublishToastProps {
  onClose: () => void;
}

export function PublishToast({ onClose }: PublishToastProps) {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex min-w-[340px] items-center gap-4 rounded-2xl border border-white/10 bg-[#1e1e2d] p-4 text-white shadow-2xl">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/20">
        <CheckCircle2 size={24} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-black uppercase tracking-widest">
          Content Deployed
        </p>
        <p className="text-xs font-medium text-gray-400">
          Your changes are now live on the portal.
        </p>
      </div>
      <button
        onClick={onClose}
        className="p-1 text-gray-500 transition-colors hover:text-white"
      >
        <X size={18} />
      </button>
    </div>
  );
}
