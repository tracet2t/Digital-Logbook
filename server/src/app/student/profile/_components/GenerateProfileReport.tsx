"use client";

import { useState } from "react";

import { jsPDF } from "jspdf";
import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  type ProfileApiData,
  type Task,
  type WarningSeverity,
} from "../_constants";

// ─── Palette ───────────────────────────────────────────────────────────────────
type RGB = readonly [number, number, number];
const P = {
  navy: [0, 0, 83] as RGB,
  navyL: [240, 242, 255] as RGB,
  dark: [15, 23, 42] as RGB,
  mid: [100, 116, 139] as RGB,
  light: [241, 245, 249] as RGB,
  border: [229, 229, 229] as RGB,
  green: [34, 197, 94] as RGB,
  red: [239, 68, 68] as RGB,
  orange: [249, 115, 22] as RGB,
  white: [255, 255, 255] as RGB,
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const trunc = (s: string, n: number) =>
  !s ? "—" : s.length > n ? s.slice(0, n - 1) + "…" : s;
const fmtDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const taskStatus = (t: Task): "Approved" | "Rejected" | "Pending" => {
  const r = (t.feedback[0]?.status ?? t.status ?? "").toLowerCase();
  return r === "accepted" || r === "approved"
    ? "Approved"
    : r === "rejected"
      ? "Rejected"
      : "Pending";
};
const statusColor = (s: ReturnType<typeof taskStatus>): RGB =>
  s === "Approved" ? P.green : s === "Rejected" ? P.red : P.orange;

// ─── PDF generation ────────────────────────────────────────────────────────────
function generatePDF(profileData: ProfileApiData, tasks: Task[]) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210,
    M = 16,
    CW = W - M * 2;
  let y = 0;

  const f = (c: RGB) => doc.setFillColor(...c);
  const d = (c: RGB) => doc.setDrawColor(...c);
  const t = (c: RGB) => doc.setTextColor(...c);
  const font = (style: string, size: number) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
  };
  const checkPage = (n = 12) => {
    if (y + n > 277) {
      doc.addPage();
      y = 18;
    }
  };

  const section = (label: string) => {
    checkPage(14);
    y += 4;
    t(P.mid);
    font("bold", 7);
    doc.text(label.toUpperCase(), M, y);
    y += 2;
    d(P.border);
    doc.setLineWidth(0.3);
    doc.line(M, y, W - M, y);
    y += 5;
  };

  const statBox = (
    x: number,
    by: number,
    w: number,
    h: number,
    val: string,
    lbl: string,
    ac: RGB,
  ) => {
    f(P.white);
    d(P.border);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, by, w, h, 2, 2, "FD");
    f(ac);
    doc.rect(x, by, 2, h, "F");
    t(P.dark);
    font("bold", 13);
    doc.text(val, x + 6, by + h / 2 - 1);
    t(P.mid);
    font("normal", 6.5);
    doc.text(lbl.toUpperCase(), x + 6, by + h / 2 + 4.5);
  };

  // Header
  f(P.navy);
  doc.rect(0, 0, W, 42, "F");
  t(P.white);
  font("bold", 16);
  doc.text(profileData.profile.fullName.toUpperCase(), M, 18);
  t([180, 190, 220] as RGB);
  font("normal", 8);
  doc.text(profileData.profile.email, M, 25);
  const genDate = `Generated: ${fmtDate(new Date())}`;
  font("normal", 6.5);
  doc.text(genDate, W - M - doc.getTextWidth(genDate), 37);
  y = 52;

  // Profile Info
  section("Profile Information");
  const info: [string, string][] = [
    ["Batch", profileData.profile.batchNo ?? "—"],
    ["Projects", profileData.projects.map((p) => p.name).join(", ") || "—"],
    ["Mentor", profileData.mentor?.fullName ?? "Not assigned"],
    ["Member Since", fmtDate(profileData.profile.createdAt)],
  ];
  info.forEach(([lbl, val], i) => {
    const ix = M + (i % 2) * (CW / 2),
      iy = y + Math.floor(i / 2) * 10;
    t(P.mid);
    font("bold", 6.5);
    doc.text(lbl.toUpperCase(), ix, iy);
    t(P.dark);
    font("normal", 8);
    doc.text(trunc(val, 42), ix, iy + 4.5);
  });
  y += Math.ceil(info.length / 2) * 10 + 4;

  // Statistics
  section("Statistics");
  const stats = profileData.statistics;
  const BH = 16,
    BW = (CW - 15) / 4;
  (
    [
      ["Total Activities", stats.totalActivities, P.navy],
      ["Approved", stats.approvedActivities, P.green],
      ["Pending", stats.pendingActivities, P.orange],
      ["Rejected", stats.rejectedActivities, P.red],
    ] as [string, number, RGB][]
  ).forEach(([lbl, val, ac], i) =>
    statBox(M + i * (BW + 5), y, BW, BH, String(val), lbl, ac),
  );
  y += BH + 4;
  statBox(M, y, CW, BH, `${stats.totalHours}h`, "Total Hours Logged", P.navy);
  y += BH + 6;

  // Badges
  if (profileData.badges.length > 0) {
    section("Achievements & Badges");
    const [BDW, BDH, GAP] = [38, 14, 5];
    profileData.badges.forEach((badge, i) => {
      const col = i % 4,
        row = Math.floor(i / 4);
      if (col === 0 && row > 0) checkPage(BDH + 4);
      const bx = M + col * (BDW + GAP),
        by = y + row * (BDH + GAP);
      f(P.navyL);
      d(P.navy);
      doc.setLineWidth(0.3);
      doc.roundedRect(bx, by, BDW, BDH, 2, 2, "FD");
      t(P.navy);
      font("bold", 6.5);
      doc.text(trunc(badge.name, 18).toUpperCase(), bx + 4, by + 5.5);
      t(P.mid);
      font("normal", 5.5);
      doc.text(`Awarded: ${fmtDate(badge.awardedAt)}`, bx + 4, by + 10.5);
    });
    y += Math.ceil(profileData.badges.length / 4) * (BDH + GAP) + 4;
  }

  // Timesheet
  section("Activities Timesheet");
  const COLS = {
    date: M,
    activity: M + 22,
    hours: M + 90,
    tech: M + 105,
    status: M + 150,
  };
  const [RH, HH] = [9, 7];
  f(P.navy);
  doc.rect(M, y, CW, HH, "F");
  t(P.white);
  font("bold", 6.5);
  (
    [
      ["DATE", COLS.date],
      ["ACTIVITY / NOTES", COLS.activity],
      ["HOURS", COLS.hours],
      ["TECHNOLOGIES", COLS.tech],
      ["STATUS", COLS.status],
    ] as [string, number][]
  ).forEach(([lbl, x]) => doc.text(lbl, x + 2, y + 4.5));
  y += HH;

  if (!tasks.length) {
    f(P.light);
    doc.rect(M, y, CW, RH, "F");
    t(P.mid);
    font("normal", 7);
    doc.text("No activities recorded.", M + 2, y + 5.5);
    y += RH;
  } else {
    tasks.forEach((task, i) => {
      checkPage(RH + 4);
      f(i % 2 === 0 ? P.white : P.light);
      d(P.border);
      doc.setLineWidth(0.2);
      doc.rect(M, y, CW, RH, "FD");
      const s = taskStatus(task),
        sc = statusColor(s);
      t(P.dark);
      font("normal", 6.5);
      doc.text(fmtDate(task.date), COLS.date + 2, y + 5.5);
      doc.text(
        trunc(task.notes || `Activity — ${fmtDate(task.date)}`, 60),
        COLS.activity + 2,
        y + 5.5,
      );
      doc.text(
        task.timeSpent > 0 ? `${task.timeSpent}h` : "—",
        COLS.hours + 2,
        y + 5.5,
      );
      t(P.mid);
      doc.text(
        task.technologies?.length
          ? trunc(task.technologies.join(", "), 30)
          : "—",
        COLS.tech + 2,
        y + 5.5,
      );
      const sl = s.toUpperCase();
      t(sc);
      font("bold", 6.5);
      doc.text(sl, COLS.status + 2, y + 5.5);
      y += RH;
    });
  }

  y += 3;
  checkPage(8);
  t(P.mid);
  font("normal", 6.5);
  doc.text(
    `${tasks.length} total activit${tasks.length === 1 ? "y" : "ies"}  ·  ${tasks.reduce((s, t) => s + (t.timeSpent || 0), 0)}h total logged`,
    M,
    y,
  );

  // Footer
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    f(P.navy);
    doc.rect(0, 287, W, 10, "F");
    t(P.white);
    font("normal", 6);
    doc.text("Digital Logbook — Confidential Profile Report", M, 293);
    const pg = `Page ${p} of ${pages}`;
    doc.text(pg, W - M - doc.getTextWidth(pg), 293);
  }

  doc.save(
    `Profile_${profileData.profile.fullName.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`,
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────
export function GenerateProfileReport({
  profileData,
  tasks,
}: {
  profileData: ProfileApiData;
  tasks: Task[];
  warningSeverity?: WarningSeverity | null;
}) {
  const [busy, setBusy] = useState(false);
  const handle = () => {
    setBusy(true);
    try {
      generatePDF(profileData, tasks);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Button
      onClick={handle}
      disabled={busy}
      className="rounded-lg bg-[#000053] px-8 py-3.5 font-inter text-[11px] font-bold leading-[16.5px] tracking-[0.1em] text-white uppercase shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] hover:bg-[#000053]/90 disabled:opacity-70"
    >
      <FileText className="mr-3 h-4 w-4" />
      {busy ? "Generating…" : "Generate PDF Full Profile Report"}
    </Button>
  );
}
