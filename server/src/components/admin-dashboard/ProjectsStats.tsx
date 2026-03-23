import { CheckCircle, FolderOpen, Users } from "lucide-react";

interface ProjectsStatsProps {
  loading: boolean;
  totalProjects: number;
  totalMentors: number;
  totalStudents: number;
}

export default function ProjectsStats({
  loading,
  totalProjects,
  totalMentors,
  totalStudents,
}: ProjectsStatsProps) {
  const stats = [
    {
      label: "Total Projects",
      value: totalProjects,
      icon: FolderOpen,
      color: "text-slate-500",
      bg: "bg-slate-100",
    },
    {
      label: "Total Mentors",
      value: totalMentors,
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Students",
      value: totalStudents,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border border-slate-200 rounded-xl px-5 py-4"
        >
          <div className="flex items-center justify-between mb-3">
            <p
              className={`text-xs font-medium uppercase tracking-wide ${stat.color}`}
            >
              {stat.label}
            </p>
            <div
              className={`h-8 w-8 rounded-lg ${stat.bg} flex items-center justify-center`}
            >
              <stat.icon size={15} className={stat.color} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {loading ? "—" : stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
