import type { MonitorStats } from "@/_hooks/admin/useAdminMonitor";
import { formatDelta } from "@/utils/monitorFormatters";

import MonitorStatCard from "@/components/admin/monitor/MonitorStatCard";

interface MonitorStatsGridProps {
  stats?: MonitorStats;
}

export default function MonitorStatsGrid({ stats }: MonitorStatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <MonitorStatCard
        label="Mentors"
        value={stats?.mentors.value ?? 0}
        helperText={
          stats ? formatDelta(stats.mentors.delta, "this month") : undefined
        }
        helperTone={stats && stats.mentors.delta > 0 ? "success" : "neutral"}
      />
      <MonitorStatCard
        label="Mentees"
        value={stats?.mentees.value ?? 0}
        helperText={
          stats ? formatDelta(stats.mentees.delta, "this month") : undefined
        }
      />
      <MonitorStatCard
        label="Submissions Today"
        value={stats?.submissionsToday.value ?? 0}
        helperText={
          stats
            ? `Previous submissions: ${stats.submissionsToday.previousTotal}`
            : undefined
        }
        helperTone="neutral"
      />
    </div>
  );
}
