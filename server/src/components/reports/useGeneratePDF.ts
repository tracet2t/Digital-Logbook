"use client";

import { useState } from "react";

import { ReportRow } from "./types";

// Hook that builds and downloads a PDF
export function useGeneratePDF(
  filteredReports: ReportRow[],
  dateFrom: string,
  dateTo: string,
) {
  const [isExporting, setIsExporting] = useState(false);

  const generatePDF = async () => {
    setIsExporting(true);
    try {
      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.default;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 40;
      let y = 50;

      // Header banner
      doc.setFillColor(6, 78, 124);
      doc.rect(0, 0, 595, 110, "F");
      doc.setFillColor(12, 112, 162);
      doc.rect(0, 70, 595, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("LOGBOOK MENTORSHIP OS", margin, 36);
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("Project Reports", margin, 58);
      doc.setFontSize(9);
      doc.text(`Generated at: ${new Date().toLocaleString()}`, margin, 74);
      doc.text("Project Name · Mentor · Mentees Count · Date", margin, 88);
      doc.setTextColor(0, 0, 0);

      y = 128;
      doc.setDrawColor(220);
      doc.line(margin, y, 555, y);
      y += 16;

      // Summary row
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Total rows exported: ${filteredReports.length}`, margin, y);
      if (dateFrom || dateTo) {
        const range = [
          dateFrom && `From: ${dateFrom}`,
          dateTo && `To: ${dateTo}`,
        ]
          .filter(Boolean)
          .join("   ");
        doc.text(range, margin + 200, y);
      }
      y += 20;

      // Table header
      const colX = {
        project: margin,
        mentor: margin + 180,
        students: margin + 360,
        date: margin + 440,
      };
      doc.setFillColor(247, 248, 250);
      doc.rect(margin, y - 10, 515, 18, "F");
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(55, 65, 81);
      doc.text("PROJECT NAME", colX.project + 3, y);
      doc.text("MENTOR", colX.mentor, y);
      doc.text("MENTEES", colX.students, y);
      doc.text("DATE", colX.date, y);
      y += 14;
      doc.setDrawColor(220);
      doc.line(margin, y, 555, y);
      y += 6;

      // Table rows
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      let rowIndex = 0;
      for (const row of filteredReports) {
        if (y > 760) {
          doc.addPage();
          y = 50;
        }
        if (rowIndex % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(margin, y - 9, 515, 14, "F");
        }
        doc.setTextColor(15, 23, 42);
        const projectText =
          row.projectName.length > 28
            ? row.projectName.slice(0, 25) + "..."
            : row.projectName;
        const mentorText =
          row.mentor.length > 20 ? row.mentor.slice(0, 17) + "..." : row.mentor;
        doc.text(projectText, colX.project + 3, y);
        doc.text(mentorText, colX.mentor, y);
        doc.text(String(row.studentsCount), colX.students + 20, y);
        doc.text(row.date, colX.date, y);
        y += 14;
        rowIndex++;
      }

      doc.save(`project-reports-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("PDF generation error", err);
      alert("Unable to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return { isExporting, generatePDF };
}
