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

      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.default;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 40;
      let y = 50;

      // Header banner
      doc.setFillColor(0, 0, 83); // brand #000053
      doc.rect(0, 0, 595, 110, "F");
      doc.setFillColor(0, 0, 120);
      doc.rect(0, 70, 595, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("LOGBOOK MENTORSHIP", margin, 36);
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("Mentee Activity Report", margin, 58);
      doc.setFontSize(9);
      doc.text(`Generated at: ${new Date().toLocaleString()}`, margin, 74);
      doc.text(`Student: ${studentName}`, margin, 88);
      doc.setTextColor(0, 0, 0);

      y = 128;
      doc.setDrawColor(220);
      doc.line(margin, y, 555, y);
      y += 16;

      // Summary
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Total activities: ${activities.length}`, margin, y);
      y += 20;

      // Column positions
      const colX = {
        date: margin,
        timeSpent: margin + 80,
        activity: margin + 140,
        feedbackStatus: margin + 330,
        feedbackNotes: margin + 430,
      };

      // Table header
      doc.setFillColor(247, 248, 250);
      doc.rect(margin, y - 10, 515, 18, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(55, 65, 81);
      doc.text("DATE", colX.date + 3, y);
      doc.text("HRS", colX.timeSpent + 3, y);
      doc.text("ACTIVITY NOTES", colX.activity + 3, y);
      doc.text("STATUS", colX.feedbackStatus + 3, y);
      doc.text("FEEDBACK", colX.feedbackNotes + 3, y);
      y += 14;
      doc.setDrawColor(220);
      doc.line(margin, y, 555, y);
      y += 6;

      // Table rows
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      let rowIndex = 0;
      for (const row of activities) {
        if (y > 760) {
          doc.addPage();
          y = 50;
        }
        if (rowIndex % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(margin, y - 9, 515, 14, "F");
        }
        doc.setTextColor(15, 23, 42);

        const activityText =
          row.activity.length > 28
            ? row.activity.slice(0, 25) + "..."
            : row.activity;
        const feedbackText =
          row.feedbackNotes.length > 18
            ? row.feedbackNotes.slice(0, 15) + "..."
            : row.feedbackNotes;

        doc.text(row.date, colX.date + 3, y);
        doc.text(String(row.timeSpent), colX.timeSpent + 3, y);
        doc.text(activityText, colX.activity + 3, y);
        doc.text(row.feedbackStatus, colX.feedbackStatus + 3, y);
        doc.text(feedbackText, colX.feedbackNotes + 3, y);
        y += 14;
        rowIndex++;
      }

      const safeName = studentName.replace(/\s+/g, "_");
      doc.save(
        `${safeName}_activity_report_${new Date().toISOString().slice(0, 10)}.pdf`,
      );
    } catch (err) {
      console.error("PDF generation error", err);
      alert("Unable to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return { isExporting, generatePDF };
}
