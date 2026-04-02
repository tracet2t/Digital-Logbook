"use client";

import React from "react";

import { BarChart3, Briefcase, Clock, Users } from "lucide-react";
import Link from "next/link";

import { useMentorDashboard } from "@/hooks/mentor";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/admin";

function StatCard({
  label,
  value,
  icon,
  isLoading = false,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  isLoading?: boolean;
}) {
  return (
    <Card className="p-4 border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {isLoading ? (
              <span className="inline-block h-8 w-16 animate-pulse rounded bg-slate-200" />
            ) : (
              value
            )}
          </p>
        </div>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>
    </Card>
  );
}

function StatusBadge({
  status,
}: {
  status: "ACCEPTED" | "PENDING" | "REJECTED";
}) {
  const styles = {
    ACCEPTED: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    PENDING: "bg-amber-50 text-amber-700 border border-amber-100",
    REJECTED: "bg-rose-50 text-rose-700 border border-rose-100",
  };

  return (
    <Badge
      className={`rounded-full px-2 py-1 text-[11px] font-semibold ${styles[status]}`}
    >
      {status}
    </Badge>
  );
}

function MenteeRow({
  initials,
  name,
  project,
  lastActivity,
  status,
}: {
  initials: string;
  name: string;
  project: string;
  lastActivity: string;
  status: "ACCEPTED" | "PENDING" | "REJECTED";
}) {
  // Generate color based on initials
  const generateColor = (initials: string) => {
    const colors = [
      { bg: "bg-blue-100", text: "text-blue-700" },
      { bg: "bg-orange-100", text: "text-orange-700" },
      { bg: "bg-teal-100", text: "text-teal-700" },
      { bg: "bg-purple-100", text: "text-purple-700" },
      { bg: "bg-pink-100", text: "text-pink-700" },
      { bg: "bg-green-100", text: "text-green-700" },
      { bg: "bg-indigo-100", text: "text-indigo-700" },
      { bg: "bg-red-100", text: "text-red-700" },
    ];

    // Use initials to generate a consistent color
    const charCode = initials.charCodeAt(0) + initials.charCodeAt(1);
    return colors[charCode % colors.length];
  };

  const colorSet = generateColor(initials);

  return (
    <TableRow className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      <TableCell>
        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold text-sm ${colorSet.bg} ${colorSet.text}`}
          >
            {initials}
          </div>
          <span className="font-medium text-slate-900">{name}</span>
        </div>
      </TableCell>
      <TableCell className="text-slate-700">{project}</TableCell>
      <TableCell className="text-slate-700">{lastActivity}</TableCell>
      <TableCell>
        <StatusBadge status={status} />
      </TableCell>
    </TableRow>
  );
}

export default function MentorDashboardPage() {
  const { data, isLoading, error } = useMentorDashboard();

  return (
    <div className="w-full min-h-screen bg-[#f5f7fb] p-4 md:p-6">
      <div className="w-full rounded-2xl border border-[#dbe5f4] bg-white shadow-sm">
        {/* Dashboard Header Area */}
        <div className="p-4 md:p-6">
          <PageHeader title="Mentor Portal" />
          <p className="mt-1 text-sm text-slate-500">
            Welcome back. Here is a summary of your mentorship activities.
          </p>
        </div>

        <div className="border-t border-dashed border-[#dbe5f4]" />

        <div className="space-y-6 p-4 md:p-6 bg-[#f8fafc]/50 rounded-b-2xl">
          {/* Error State */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-800">
                {error.message ||
                  "Failed to load dashboard data. Please try again."}
              </p>
            </div>
          )}

          {/* Stats Grid - 4 columns for desktop */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="TOTAL MENTEES"
              value={data?.stats.totalMentees ?? 0}
              icon={<Users className="h-5 w-5 text-slate-500" />}
              isLoading={isLoading}
            />
            <StatCard
              label="PROJECTS"
              value={data?.stats.projects ?? 0}
              icon={<Briefcase className="h-5 w-5 text-slate-500" />}
              isLoading={isLoading}
            />
            <StatCard
              label="TOTAL WORKING HOURS"
              value={`${data?.stats.totalWorkingHours ?? 0}h`}
              icon={<Clock className="h-5 w-5 text-slate-500" />}
              isLoading={isLoading}
            />
            <StatCard
              label="AVERAGE WORKING HOURS"
              value={`${data?.stats.averageWorkingHours ?? 0}h`}
              icon={<BarChart3 className="h-5 w-5 text-slate-500" />}
              isLoading={isLoading}
            />
          </div>

          {/* Recently Active Mentees Section */}
          <Card className="p-4 md:p-5 border-[#e3ebf8] shadow-sm rounded-2xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-2">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-slate-900 tracking-tight">
                  Recently Active Mentees
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Track mentee progress and engagement status.
                </p>
              </div>
              <Link
                href="/mentor/mentees"
                className="rounded-md px-4 py-2 text-sm font-medium bg-[#000053] text-white hover:bg-[#000040] transition-colors inline-block"
              >
                View All
              </Link>
            </div>

            {isLoading ? (
              <div className="mt-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 animate-pulse rounded-lg bg-slate-200"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="mt-5 border border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-500">
                Failed to load mentees. Please try again.
              </div>
            ) : !data || data.recentlyActiveMentees.length === 0 ? (
              <div className="mt-5 border border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-500">
                No recent mentees available.
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-[#e3ebf8]">
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 h-10">
                        NAME
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 h-10">
                        PROJECT
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 h-10">
                        LAST ACTIVITY
                      </TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 h-10">
                        STATUS
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recentlyActiveMentees.map((mentee) => (
                      <MenteeRow
                        key={`${mentee.initials}-${mentee.name}`}
                        initials={mentee.initials}
                        name={mentee.name}
                        project={mentee.project}
                        lastActivity={mentee.lastActivity}
                        status={mentee.status}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
