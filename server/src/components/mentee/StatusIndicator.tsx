/**
 * StatusIndicator.tsx
 * Pill badge with coloured dot and hover tooltip showing the student's
 * warning severity. Colors mirror the MenteeAvatar warning ring.
 */
import {
  STATUS_CONFIG,
  type WarningSeverity,
} from "@/app/student/profile/_constants";

type Props = {
  severity: WarningSeverity;
};

export function StatusIndicator({ severity }: Props) {
  const c = STATUS_CONFIG[severity];
  return (
    <div className="group relative flex cursor-default select-none items-center gap-2">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-inter text-[10px] font-bold leading-[15px] tracking-[0.05em] uppercase ${c.border} ${c.bg} ${c.text}`}
      >
        <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${c.dot}`} />
        {c.label}
      </span>
      {/* Tooltip — visible on hover/focus */}
      <span className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 w-max max-w-[220px] rounded-md bg-[#0F172A] px-3 py-2 font-inter text-[11px] font-medium leading-[17px] text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
        {c.tooltip}
      </span>
    </div>
  );
}
