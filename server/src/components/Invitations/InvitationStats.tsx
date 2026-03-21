import { Users, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface InvitationsStatsProps {
  loading: boolean;
  total: number;
  pending: number;
  accepted: number;
  expired: number;
}

export default function InvitationsStats({ loading, total, pending, accepted, expired }: InvitationsStatsProps) {
  const stats = [
    { label: 'Total', value: total, icon: Users, color: 'text-slate-500', bg: 'bg-slate-100' },
    { label: 'Pending', value: pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Accepted', value: accepted, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Expired', value: expired, icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white border border-slate-200 rounded-xl px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-medium uppercase tracking-wide ${stat.color}`}>{stat.label}</p>
            <div className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon size={15} className={stat.color} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{loading ? '—' : stat.value}</p>
        </div>
      ))}
    </div>
  );
}