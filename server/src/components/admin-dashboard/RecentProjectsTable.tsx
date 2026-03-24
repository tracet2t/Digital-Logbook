"use client";

import Link from "next/link";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge, { ProjectStatus } from "./StatusBadge";

export interface ProjectRow {
  projectName: string;
  domain: string;
  dateCreated: string;
  status: ProjectStatus;
}

interface RecentProjectsTableProps {
  projects: ProjectRow[];
}

export default function RecentProjectsTable({
  projects,
}: RecentProjectsTableProps) {
  return (
    <Card className="mt-4 p-4 md:mt-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Recently Created Projects
          </h2>
          <p className="text-sm text-slate-500">
            Track project onboarding and delivery status.
          </p>
        </div>

        <Link
          href="/admin/projects"
          className="inline-flex rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          View All Projects
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
          No recent projects available.
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={`${project.projectName}-${project.dateCreated}`}>
                  <TableCell>{project.projectName}</TableCell>
                  <TableCell>{project.domain}</TableCell>
                  <TableCell>{project.dateCreated}</TableCell>
                  <TableCell>
                    <StatusBadge status={project.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}