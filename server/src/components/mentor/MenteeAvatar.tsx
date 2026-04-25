"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useQuery } from "@tanstack/react-query";

import { WarningCategory } from "@prisma/client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type WarningStatusItem = {
  id: string;
  studentId: string;
  comment: string;
  warningType: WarningCategory | null;
};

type Props = {
  studentId: string;
  name: string;
  initials: string;
  className?: string;
  style?: CSSProperties;
  onClick?: (e: MouseEvent<HTMLSpanElement>) => void;
};

// Severity order: high > medium > low > none
const SEVERITY_ORDER: (WarningCategory | null)[] = [
  "high",
  "medium",
  "low",
  null,
];

// Returns the highest-severity warning category from a list
function getHighestSeverity(
  types: (WarningCategory | null)[],
): WarningCategory | null {
  for (const level of SEVERITY_ORDER) {
    if (types.includes(level)) return level;
  }
  return null;
}

// Maps warning severity to ring/border Tailwind classes
const RING_CLASS: Record<WarningCategory, string> = {
  low: "ring-2 ring-yellow-400",
  medium: "ring-[3px] ring-orange-400",
  high: "ring-[3px] ring-red-500",
};

// Avatar that shows a coloured ring matching the student's highest warning severity
export function MenteeAvatar({
  studentId,
  name,
  initials,
  className,
  style,
  onClick,
}: Props) {
  const { data: warnings = [] } = useQuery<WarningStatusItem[]>({
    queryKey: ["warning-status", studentId],
    queryFn: async () => {
      const response = await fetch(
        `/api/warningStatus?studentId=${encodeURIComponent(studentId)}`,
      );
      if (!response.ok) throw new Error("Failed to fetch warning statuses");
      return response.json();
    },
    enabled: Boolean(studentId),
  });

  const severity = getHighestSeverity(warnings.map((w) => w.warningType));

  return (
    <Avatar
      className={cn(
        "h-10 w-10 shrink-0 border border-[#d9dde5] bg-[#f5f7fb]",
        severity ? RING_CLASS[severity] : undefined,
        className,
      )}
      title={severity ? `${severity} warning` : name}
      style={style}
      onClick={onClick}
    >
      <AvatarFallback className="bg-[#000053] text-xs font-bold text-white">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
