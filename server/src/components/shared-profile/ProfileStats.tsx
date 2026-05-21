/**
 * @file ProfileStats — activity statistics grid (total, approved, pending, rejected).
 */

interface Statistics {
  totalActivities: number;
  approvedActivities: number;
  pendingActivities: number;
  rejectedActivities: number;
}

interface ProfileStatsProps {
  statistics: Statistics;
}

/** Colour-value pair for a single stat card */
interface StatItem {
  label: string;
  value: number;
  colour: string;
}

/**
 * Grid of stat cards displaying total, approved, pending, and rejected activity counts.
 */
export function ProfileStats({ statistics }: ProfileStatsProps) {
  const cards: StatItem[] = [
    {
      label: "Total Tasks",
      value: statistics.totalActivities,
      colour: "#000053",
    },
    {
      label: "Approved",
      value: statistics.approvedActivities,
      colour: "#22C55E",
    },
    {
      label: "Pending",
      value: statistics.pendingActivities,
      colour: "#EAB308",
    },
    {
      label: "Rejected",
      value: statistics.rejectedActivities,
      colour: "#EF4444",
    },
  ];

  return (
    <section className="border-b border-[#E5E5E5] px-3 py-5 sm:px-5">
      <h2 className="mb-4 font-inter text-[11px] font-bold leading-[16.5px] tracking-[0.15em] text-[#94A3B8] uppercase">
        Activity Statistics
      </h2>
      <div className="grid grid-cols-2 gap-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-[#E5E5E5] bg-[#F8FAFC] p-4 text-center"
          >
            <p
              className="font-inter text-xl sm:text-2xl font-extrabold"
              style={{ color: card.colour }}
            >
              {card.value}
            </p>
            <p className="font-inter text-[8px] font-bold tracking-[0.1em] text-[#64748B] uppercase">
              {card.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
