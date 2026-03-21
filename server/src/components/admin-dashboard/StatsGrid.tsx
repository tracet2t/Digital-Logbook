"use client";

import StatCard, { StatCardProps } from "./StatCard";

interface StatsGridProps {
  stats: StatCardProps[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((item) => (
        <StatCard
          key={item.label}
          label={item.label}
          value={item.value}
          trendLabel={item.trendLabel}
          trendType={item.trendType}
          icon={item.icon}
        />
      ))}
    </div>
  );
}
