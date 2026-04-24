"use client";

import React from "react";

import moment from "moment";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MenteeAvatar } from "@/components/mentor/MenteeAvatar";

// ─── Shared types ──────────────────────────────────────────────────────────

export interface MenteeItem {
  id: string;
  name: string;
  avatar?: string;
}

export interface MenteeTaskRow {
  name: string;
  avatar?: string;
  task: string;
  status: "pending" | "approved" | "rejected";
  activityId: string;
  studentId: string;
  timeSpent: number;
  date: string;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

// ─── MenteeAvatarCell ──────────────────────────────────────────────────────

interface MenteeAvatarCellProps {
  dateKey: string;
  menteeIds: string[];
  allMentees: MenteeItem[];
  onAvatarClick: (menteeId: string, dateKey: string) => void;
}

const MAX_VISIBLE = 4;

export function MenteeAvatarCell({
  dateKey,
  menteeIds,
  allMentees,
  onAvatarClick,
}: MenteeAvatarCellProps) {
  if (menteeIds.length === 0) return null;

  const visibleIds = menteeIds.slice(0, MAX_VISIBLE);
  const extraCount = menteeIds.length - visibleIds.length;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center pt-1" style={{ gap: 0 }}>
        {visibleIds.map((menteeId, i) => {
          const mentee = allMentees.find((m) => m.id === menteeId);
          const name = mentee?.name ?? "Unknown";
          return (
            <Tooltip key={menteeId}>
              <TooltipTrigger asChild>
                <MenteeAvatar
                  studentId={menteeId}
                  name={name}
                  initials={getInitials(name)}
                  className="h-8 w-8 border-2 border-white cursor-pointer hover:z-10 transition-transform hover:-translate-y-0.5"
                  style={{ marginLeft: i === 0 ? 0 : "-6px", zIndex: i }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAvatarClick(menteeId, dateKey);
                  }}
                />
              </TooltipTrigger>
              <TooltipContent side="top">{name}</TooltipContent>
            </Tooltip>
          );
        })}
        {extraCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar
                className="h-8 w-8 border-2 border-white cursor-default"
                style={{ marginLeft: "-6px", zIndex: visibleIds.length }}
              >
                <AvatarFallback className="bg-slate-400 text-white text-[11px] font-bold">
                  +{extraCount}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="top">{extraCount} more</TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}

// ─── MenteeTaskTable ───────────────────────────────────────────────────────

interface MenteeTaskTableProps {
  date: string;
  selectedMenteeName: string | null;
  tableRows: MenteeTaskRow[];
  onClose: () => void;
  onRowClick: (row: MenteeTaskRow) => void;
}

export function MenteeTaskTable({
  date,
  selectedMenteeName,
  tableRows,
  onClose,
  onRowClick,
}: MenteeTaskTableProps) {
  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50">
        <div>
          <p className="text-lg font-semibold text-slate-800 mt-0.5">
            {selectedMenteeName
              ? `${selectedMenteeName}'s Tasks`
              : "All Mentees Tasks"}
          </p>
          <p className="text-xs text-slate-900 uppercase tracking-wide font-medium">
            {moment(date).format("MMMM D, YYYY")}
          </p>
        </div>
        <button
          className="text-slate-400 hover:text-slate-600 text-lg leading-none"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      <div
        className="max-h-[55vh] overflow-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left py-2.5 px-5 font-semibold text-slate-600 w-1/3">
                Name
              </th>
              <th className="text-left py-2.5 px-5 font-semibold text-slate-600">
                Task
              </th>
              <th className="text-left py-2.5 px-5 font-semibold text-slate-600 w-28">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-slate-100 hover:bg-indigo-50 cursor-pointer transition-colors"
                onClick={() => onRowClick(row)}
              >
                <td className="py-2.5 px-5 text-slate-700 font-medium">
                  <div className="flex items-center gap-3">
                    <MenteeAvatar
                      studentId={row.studentId}
                      name={row.name}
                      initials={getInitials(row.name)}
                    />
                    <span>{row.name}</span>
                  </div>
                </td>
                <td className="py-2.5 px-5 text-slate-600">{row.task}</td>
                <td className="py-2.5 px-5">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                      row.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : row.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
            {tableRows.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="py-8 text-center text-slate-400 text-sm"
                >
                  No tasks for this date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
