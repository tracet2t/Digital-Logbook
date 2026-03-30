"use client";

import React from "react";

import { BarChart3, Briefcase, Clock, Users } from "lucide-react";
import Link from "next/link";

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

interface MenteeRow {
  initials: string;
  name: string;
  project: string;
  lastActivity: string;
  status: "ACCEPTED" | "PENDING" | "REJECTED";
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="p-4 border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
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

export default function MentorDashboardPage() {
  // Mock data
  const menteeAvatarColors: Record<string, string> = {
    SM: "bg-blue-100",
    JL: "bg-orange-100",
    EK: "bg-teal-100",
    RT: "bg-purple-100",
    AD: "bg-blue-400",
  };

  const menteeAvatarTextColors: Record<string, string> = {
    SM: "text-blue-700",
    JL: "text-orange-700",
    EK: "text-teal-700",
    RT: "text-purple-700",
    AD: "text-white",
  };

  const recentlyActiveMentees: MenteeRow[] = [
    {
      initials: "SM",
      name: "Sarah Mitchell",
      project: "Blockchain Identity Archiving",
      lastActivity: "2 mins ago",
      status: "ACCEPTED",
    },
    {
      initials: "JL",
      name: "Julian Lefebvre",
      project: "Quantum Neural Networks",
      lastActivity: "1 hour ago",
      status: "PENDING",
    },
    {
      initials: "EK",
      name: "Elena Kovic",
      project: "Semantic Web Integration",
      lastActivity: "4 hours ago",
      status: "ACCEPTED",
    },
    {
      initials: "RT",
      name: "Robert Thorne",
      project: "Legacy Data Migration",
      lastActivity: "Yesterday",
      status: "REJECTED",
    },
    {
      initials: "AD",
      name: "Aria Dupont",
      project: "API Standardization Project",
      lastActivity: "2 days ago",
      status: "ACCEPTED",
    },
  ];

  return (
    <div className="flex-1 p-5 md:p-8">
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Dashboard Overview
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Mentor Portal
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Welcome back. Here is a summary of your mentorship activities.
          </p>
        </div>

        {/* Stats Grid - 4 columns for desktop */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Mentees"
            value="24"
            icon={<Users className="h-5 w-5 text-slate-500" />}
          />
          <StatCard
            label="Projects"
            value="12"
            icon={<Briefcase className="h-5 w-5 text-slate-500" />}
          />
          <StatCard
            label="Total Working Hours"
            value="156h"
            icon={<Clock className="h-5 w-5 text-slate-500" />}
          />
          <StatCard
            label="Average Working Hours"
            value="12.5h"
            icon={<BarChart3 className="h-5 w-5 text-slate-500" />}
          />
        </div>

        {/* Recently Active Mentees Section */}
        <Card className="p-4 md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                Recently Active Mentees
              </h2>
              <p className="text-sm text-slate-500">
                Track mentee progress and engagement status.
              </p>
            </div>
            <Link
              href="/mentor/mentees"
              className="rounded-md px-3 py-2 text-sm font-medium bg-[#000053] text-white hover:bg-[#000040] border border-transparent transition-colors inline-block"
            >
              View All
            </Link>
          </div>

          {recentlyActiveMentees.length === 0 ? (
            <div className="mt-5 border border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-500">
              No recent mentees available.
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs uppercase tracking-wider text-slate-600">
                      NAME
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-slate-600">
                      PROJECT
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-slate-600">
                      LAST ACTIVITY
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-slate-600">
                      STATUS
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentlyActiveMentees.map((mentee) => (
                    <TableRow
                      key={`${mentee.initials}-${mentee.name}`}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold text-sm ${
                              menteeAvatarColors[mentee.initials] ||
                              "bg-slate-200"
                            } ${
                              menteeAvatarTextColors[mentee.initials] ||
                              "text-slate-700"
                            }`}
                          >
                            {mentee.initials}
                          </div>
                          <span className="font-medium text-slate-900">
                            {mentee.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {mentee.project}
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {mentee.lastActivity}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={mentee.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
