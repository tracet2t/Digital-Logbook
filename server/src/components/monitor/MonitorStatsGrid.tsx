import type { MonitorStats } from "@/_hooks/admin/useAdminMonitor";
import {
  formatDelta,
  formatDeltaVs,
  formatMtdDelta,
} from "@/utils/monitorFormatters";

import MonitorStatCard from "@/components/admin/monitor/MonitorStatCard";

interface MonitorStatsGridProps {
  stats?: MonitorStats;
}

export default function MonitorStatsGrid({ stats }: MonitorStatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
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
          stats ? formatDeltaVs(stats.submissionsToday.delta) : undefined
        }
        helperTone={
          stats && stats.submissionsToday.delta > 0 ? "success" : "neutral"
        }
      />
      <MonitorStatCard
        label="Missed Reviews"
        value={stats?.missedReviews.value ?? 0}
        helperText={
          stats ? `${stats.missedReviews.value} unresolved` : undefined
        }
        helperTone={
          stats && stats.missedReviews.value > 0 ? "danger" : "neutral"
        }
      />
      <MonitorStatCard
        label="Completion Rate"
        value={`${stats?.completionRate.value ?? 0}%`}
        helperText={
          stats ? formatMtdDelta(stats.completionRate.delta) : undefined
        }
        helperTone={
          stats && stats.completionRate.delta >= 0 ? "success" : "danger"
        }
      />
    </div>
  );
}
