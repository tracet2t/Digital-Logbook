"use client";

import { Globe, Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableActionMenu from "@/components/admin/TableActionMenu";
import TableStateRows from "@/components/admin/TableStateRows";

export interface ProjectRow {
  id: string;
  name: string;
  domain: string;
  mentors: number;
  students: number;
  createdBy: string;
  createdDate: string;
  description?: string;
  mentorList?: Array<{ id: string; name: string }>;
  studentList?: Array<{ id: string; name: string }>;
}

interface ProjectsTableProps {
  data: ProjectRow[];
  loading: boolean;
  error?: boolean;
  domainIcons: Record<string, React.ReactNode>;
  domainLabels: Record<string, string>;
  onView: (project: ProjectRow) => void;
  onEdit: (project: ProjectRow) => void;
  onDelete: (id: string) => void;
}

export default function ProjectsTable({
  data,
  loading,
  error = false,
  domainIcons,
  domainLabels,
  onView,
  onEdit,
  onDelete,
}: ProjectsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
          <TableHead className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Project Name
          </TableHead>
          <TableHead className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Domain
          </TableHead>
          <TableHead className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Mentors
          </TableHead>
          <TableHead className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Students
          </TableHead>
          <TableHead className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Created By
          </TableHead>
          <TableHead className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Created Date
          </TableHead>
          <TableHead className="px-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableStateRows
          colSpan={7}
          loading={loading}
          error={error}
          empty={!loading && !error && data.length === 0}
          loadingMessage="Loading projects..."
          emptyMessage="No projects found."
        />
        {!loading &&
          !error &&
          data.map((project) => (
            <TableRow key={project.id} className="bg-white hover:bg-[#fbfcff]">
              <TableCell className="px-4 py-3 font-medium text-slate-900">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#F0F0F0] shrink-0">
                    {domainIcons[project.domain] ?? <Globe size={18} />}
                  </div>
                  <span>{project.name}</span>
                </div>
              </TableCell>
              <TableCell className="px-4 py-3">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#EBEBEB] text-slate-900">
                  {domainLabels[project.domain] ?? project.domain}
                </span>
              </TableCell>
              <TableCell className="px-4 py-3 text-slate-900 font-medium">
                {project.mentors}
              </TableCell>
              <TableCell className="px-4 py-3 text-slate-900 font-medium">
                {project.students}
              </TableCell>
              <TableCell className="px-4 py-3 text-slate-900 font-medium">
                {project.createdBy}
              </TableCell>
              <TableCell className="px-4 py-3 text-slate-500">
                {project.createdDate}
              </TableCell>
              <TableCell className="px-4 py-3 text-right">
                <TableActionMenu
                  ariaLabel={`Actions for ${project.name}`}
                  items={[
                    { label: "View Details", onSelect: () => onView(project) },
                    {
                      label: "Edit Project",
                      onSelect: () => onEdit(project),
                    },
                    {
                      label: "Delete",
                      onSelect: () => onDelete(project.id),
                      variant: "danger",
                      separator: true,
                      icon: <Trash2 size={14} />,
                    },
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
