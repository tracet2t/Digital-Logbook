"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export type TrendType = "positive" | "negative" | "neutral";

export interface StatCardProps {
  label: string;
  value?: string | number;
  trendLabel?: string;
  trendType?: TrendType;
  icon?: React.ReactNode;
}

const trendClasses: Record<TrendType, string> = {
  positive: "bg-emerald-50 text-emerald-700 border-emerald-100",
  negative: "bg-rose-50 text-rose-700 border-rose-100",
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function StatCard({
  label,
  value = "--",
  trendLabel,
  trendType = "neutral",
  icon,
}: StatCardProps) {
  return (
    <Card className="p-4 border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
      {trendLabel ? (
        <div className="mt-3 flex items-center gap-2">
          <Badge
            className={`rounded-full px-2 py-1 text-[11px] font-medium ${trendClasses[trendType]}`}
          >
            {trendLabel}
          </Badge>
          <p className="text-xs text-slate-500">since last month</p>
        </div>
      ) : null}
    </Card>
  );
}
