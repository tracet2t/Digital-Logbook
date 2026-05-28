import { Card } from "@/components/ui/card";

interface MonitorStatCardProps {
  label: string;
  value: string | number;
  helperText?: string;
  helperTone?: "neutral" | "success" | "warning" | "danger";
}

const helperToneClasses: Record<
  NonNullable<MonitorStatCardProps["helperTone"]>,
  string
> = {
  neutral: "text-slate-500",
  success: "text-emerald-600",
  warning: "text-amber-600",
  danger: "text-rose-600",
};

export default function MonitorStatCard({
  label,
  value,
  helperText,
  helperTone = "neutral",
}: MonitorStatCardProps) {
  return (
    <Card className="rounded-xl border border-[#e5e7eb] bg-white p-4">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="text-2xl font-bold text-[#0a0f57]">{value}</p>
        {helperText ? (
          <p className={`text-xs ${helperToneClasses[helperTone]}`}>
            {helperText}
          </p>
        ) : null}
      </div>
    </Card>
  );
}
