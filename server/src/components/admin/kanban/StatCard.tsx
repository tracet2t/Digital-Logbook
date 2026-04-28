import { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: "slate" | "amber" | "emerald" | "rose";
}

const tones: Record<string, string> = {
  slate: "bg-slate-50 text-slate-600 border-slate-200",
  amber: "bg-amber-50 text-amber-600 border-amber-200",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
  rose: "bg-rose-50 text-rose-600 border-rose-200",
};

export function StatCard({ label, value, icon: Icon, tone }: StatCardProps) {
  return (
    <Card className="rounded-2xl border-[#e4e7ed] p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
          {label}
        </span>
        <div className={`rounded-xl border p-2 ${tones[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-3xl font-black text-[#000053]">{value}</p>
    </Card>
  );
}
