"use client";

import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  userName?: string;
  onRequestExport?: () => void;
}

export default function DashboardHeader({
  userName,
  onRequestExport,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Dashboard Overview
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Admin Super Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Welcome back{userName ? `, ${userName}` : ""}! Here’s your latest
          platform summary.
        </p>
      </div>
      <Button
        className="h-10 bg-[#4F46E5] text-white hover:bg-[#4338CA]"
        onClick={onRequestExport}
      >
        Export Data
      </Button>
    </div>
  );
}
