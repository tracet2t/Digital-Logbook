import {
  BarChart2,
  BookOpen,
  Briefcase,
  Cpu,
  FolderOpen,
  GraduationCap,
  Layers,
  Monitor,
  Palette,
  Users,
  type LucideIcon,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableStateRows from "@/components/admin/TableStateRows";

import { ReportRow } from "./types";

interface IconConfig {
  Icon: LucideIcon;
  bg: string;
  color: string;
}

// Maps keywords in the project name to an appropriate icon (all use grey styling)
function getProjectIcon(name: string): IconConfig {
  const lower = name.toLowerCase();
  if (/ui|ux|design|figma|visual/.test(lower))
    return { Icon: Palette, bg: "bg-[#f0f0f0]", color: "text-[#737373]" };
  if (/train|learn|educat|course|portal/.test(lower))
    return { Icon: BookOpen, bg: "bg-[#f0f0f0]", color: "text-[#737373]" };
  if (/logbook|log|digital|mvp|app/.test(lower))
    return { Icon: Cpu, bg: "bg-[#f0f0f0]", color: "text-[#737373]" };
  if (/data|analytic|report|metric|stat/.test(lower))
    return { Icon: BarChart2, bg: "bg-[#f0f0f0]", color: "text-[#737373]" };
  if (/mentor|coach|guide/.test(lower))
    return { Icon: Users, bg: "bg-[#f0f0f0]", color: "text-[#737373]" };
  if (/student|grad|school|academ/.test(lower))
    return { Icon: GraduationCap, bg: "bg-[#f0f0f0]", color: "text-[#737373]" };
  if (/web|site|platform/.test(lower))
    return { Icon: Monitor, bg: "bg-[#f0f0f0]", color: "text-[#737373]" };
  if (/system|infra|layer|stack/.test(lower))
    return { Icon: Layers, bg: "bg-[#f0f0f0]", color: "text-[#737373]" };
  if (/business|enterprise|client|work/.test(lower))
    return { Icon: Briefcase, bg: "bg-[#f0f0f0]", color: "text-[#737373]" };
  // Default fallback
  return { Icon: FolderOpen, bg: "bg-[#f0f0f0]", color: "text-[#737373]" };
}

interface Props {
  isLoading: boolean;
  fetchError: string | null;
  visibleReports: ReportRow[];
}

// Renders the report rows for the current page
export function ReportsTable({ isLoading, fetchError, visibleReports }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
          <TableHead className="text-xs font-bold uppercase text-[#737373]">
            Project Name
          </TableHead>
          <TableHead className="text-xs font-bold uppercase text-[#737373]">
            Mentor
          </TableHead>
          <TableHead className="text-xs font-bold uppercase text-[#737373]">
            Students Count
          </TableHead>
          <TableHead className="text-xs font-bold uppercase text-[#737373]">
            Date
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableStateRows
          colSpan={4}
          loading={isLoading}
          error={fetchError}
          empty={visibleReports.length === 0}
          loadingMessage="Loading reports..."
          emptyMessage="No reports found for the selected filters."
        />
        {!isLoading &&
          !fetchError &&
          visibleReports.map((report) => {
            const { Icon, bg, color } = getProjectIcon(report.projectName);
            return (
              <TableRow key={report.id} className="hover:bg-[#F5F5F5]">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${bg}`}
                    >
                      <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                    <span className="font-semibold text-[#0A0A0A]">
                      {report.projectName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-[#0A0A0A]">
                  {report.mentor}
                </TableCell>
                <TableCell className="text-[#0A0A0A]">
                  {report.studentsCount}
                </TableCell>
                <TableCell className="text-[#737373]">{report.date}</TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
