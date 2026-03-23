export default function StatusBadge({ status }: { status: 'Pending' | 'Accepted' | 'Expired' }) {
  const styles = {
    Pending: "bg-amber-50 text-amber-600 border-amber-200/60",
    Accepted: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
    Expired: "bg-rose-50 text-rose-600 border-rose-200/60",
  };
  const dotColors = {
    Pending: "bg-amber-500",
    Accepted: "bg-emerald-500",
    Expired: "bg-rose-500",
  };
  const labels = {
    Pending: "Pending",
    Accepted: "Active",
    Expired: "Expired",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]}`} />
      {labels[status]}
    </span>
  );
}