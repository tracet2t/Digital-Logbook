"use client";

import { useState } from "react";

interface ActivityRow {
  studentName: string;
  date: string;
  timeSpent: number;
  activity: string;
  feedbackStatus: string;
  feedbackNotes: string;
}

interface MenteeReportData {
  studentName: string;
  activities: ActivityRow[];
}

export function useGenerateMenteePDF() {
  const [isExporting, setIsExporting] = useState(false);

  const generatePDF = async (menteeId: string) => {
    if (!menteeId) return;
    setIsExporting(true);

    try {
      const res = await fetch(`/api/report?menteeId=${menteeId}&format=json`);
      if (!res.ok) throw new Error("Failed to fetch mentee data");

      const data: MenteeReportData = await res.json();
      const { studentName, activities } = data;

      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });

      const margin = 40;
      let y = 50;
      const pageHeight = doc.internal.pageSize.height;

      // ================= HEADER =================
      doc.setFillColor(0, 0, 83);
      doc.rect(0, 0, 595, 110, "F");

      doc.setFillColor(10, 10, 120);
      doc.rect(0, 70, 595, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("LOGBOOK MENTORSHIP", margin, 35);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Mentee Activity Report", margin, 55);

      doc.setFontSize(9);
      doc.text(`Generated at: ${new Date().toLocaleString()}`, margin, 85);
      doc.text(`Student: ${studentName}`, margin, 100);

      doc.setTextColor(0, 0, 0);

      y = 130;

      // ================= SUMMARY =================
      doc.setFontSize(10);
      doc.text(`Total activities: ${activities.length}`, margin, y);
      y += 20;

      // ================= TABLE HEADER =================
      const colX = {
        date: margin,
        hrs: margin + 80,
        activity: margin + 130,
        status: margin + 330,
        feedback: margin + 410,
      };

      doc.setFillColor(240, 240, 240);
      doc.rect(margin, y - 10, 515, 20, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(60, 60, 60);

      doc.text("DATE", colX.date, y);
      doc.text("HRS", colX.hrs, y);
      doc.text("ACTIVITY NOTES", colX.activity, y);
      doc.text("STATUS", colX.status, y);
      doc.text("FEEDBACK", colX.feedback, y);

      y += 15;

      // ================= TABLE ROWS =================
      doc.setFont("helvetica", "normal");

      activities.forEach((row, index) => {
        if (y > 750) {
          doc.addPage();
          y = 50;
        }

        // zebra rows
        if (index % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, y - 10, 515, 18, "F");
        }

        const activity =
          row.activity.length > 30
            ? row.activity.slice(0, 28) + "..."
            : row.activity;

        const feedback =
          row.feedbackNotes.length > 20
            ? row.feedbackNotes.slice(0, 18) + "..."
            : row.feedbackNotes;

        doc.setTextColor(20, 20, 20);

        doc.text(row.date, colX.date, y);
        doc.text(String(row.timeSpent), colX.hrs, y);
        doc.text(activity, colX.activity, y);

        // ✅ STATUS AS TEXT ONLY
        doc.text(row.feedbackStatus, colX.status, y);

        doc.text(feedback, colX.feedback, y);

        y += 18;
      });

      // ================= SIGNATURES (BOTTOM) =================
      const signY = pageHeight - 80;

      doc.setDrawColor(180);

      doc.line(margin + 200, signY, margin + 330, signY);
      doc.line(margin + 350, signY, margin + 480, signY);

      doc.setFontSize(8);
      doc.setTextColor(100);

      doc.text("MENTEE SIGNATURE", margin + 210, signY + 12);
      doc.text("MENTOR APPROVAL", margin + 360, signY + 12);

      // ================= FOOTER =================
      doc.setFontSize(8);
      doc.setTextColor(120);

      doc.text("Logbook Mentorship © 2026", margin, pageHeight - 40);
      doc.text("Confidential Mentee Progress Report", margin, pageHeight - 25);
      doc.text("Page 1 of 1", 480, pageHeight - 40);

      // ================= SAVE =================
      const safeName = studentName.replace(/\s+/g, "_");

      doc.save(
        `${safeName}_activity_report_${new Date().toISOString().slice(0, 10)}.pdf`
      );

    } catch (err) {
      console.error(err);
      alert("PDF generation failed");
    } finally {
      setIsExporting(false);
    }
  };

  return { isExporting, generatePDF };
}