"use client";

import { useState } from "react";

import {
  Activity,
  Briefcase,
  GraduationCap,
  Mail,
  UserCheck,
  Users,
} from "lucide-react";

import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AdminPageLayout,
  PageHeader,
} from "@/components/admin";

import RecentProjectsTable from "./RecentProjectsTable";
import StatsGrid from "./StatsGrid";

interface SuperAdminDashboardProps {
  userName?: string;
}

export default function SuperAdminDashboard({
  userName,
}: SuperAdminDashboardProps) {
  const { stats, recentProjects, isLoading, error } = useAdminDashboard();
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [chosenFormat, setChosenFormat] = useState<"csv" | "pdf">("csv");
  const [isExporting, setIsExporting] = useState(false);

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers || "--",
      icon: <Users className="h-5 w-5 text-slate-500" />,
    },
    {
      label: "Students",
      value: stats.students || "--",
      icon: <GraduationCap className="h-5 w-5 text-slate-500" />,
    },
    {
      label: "Mentors",
      value: stats.mentors || "--",
      icon: <UserCheck className="h-5 w-5 text-slate-500" />,
    },
    {
      label: "Total Projects",
      value: stats.totalProjects || "--",
      icon: <Briefcase className="h-5 w-5 text-slate-500" />,
    },
    {
      label: "Pending Invites",
      value: stats.pendingInvites || "--",
      icon: <Mail className="h-5 w-5 text-slate-500" />,
    },
    {
      label: "Active Projects",
      value: stats.activeProjects || "--",
      icon: <Activity className="h-5 w-5 text-slate-500" />,
    },
  ];

  const createCSV = () => {
    const lines: string[] = [];
    lines.push("Dashboard Report");
    lines.push(`Generated at:,${new Date().toLocaleString()}`);
    lines.push(" ");
    lines.push("Section,Key,Value");

    cards.forEach((card) => {
      lines.push(`Metrics,${card.label},${card.value}`);
    });

    lines.push(" ");
    lines.push("Section,Project Name,Domain,Date Created,Status");
    recentProjects.forEach((project) => {
      lines.push(
        `Projects,${project.projectName},${project.domain},${project.dateCreated},${project.status}`,
      );
    });

    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dashboard-report-${new Date().toISOString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const createPDF = async () => {
    try {
      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.default;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 40;
      let y = 50;

      // Title block with accent gradient-style background
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
      doc.text("Dashboard Report", margin, 58);
      doc.setFontSize(9);
      doc.text(`Generated at: ${new Date().toLocaleString()}`, margin, 74);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.text("Summary metrics and recent project performance.", margin, 88);
      doc.setTextColor(0, 0, 0);

      y = 120;
      doc.setDrawColor(220);
      doc.line(margin, y, 555, y);
      y += 18;

      // Metrics card panel
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Summary Metrics", margin, y);
      y += 14;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      const metricStartX = margin;
      let boxX = metricStartX;
      const boxY = y;
      const boxW = 160;
      const boxH = 58;
      const metricColors = [
        [219, 234, 254],
        [220, 252, 231],
        [254, 226, 226],
      ];
      cards.slice(0, 3).forEach((card, idx) => {
        const [r, g, b] = metricColors[idx];
        doc.setFillColor(r, g, b);
        doc.roundedRect(boxX, boxY, boxW, boxH, 8, 8, "F");
        doc.setDrawColor(203);
        doc.roundedRect(boxX, boxY, boxW, boxH, 8, 8, "S");
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42);
        doc.text(card.label, boxX + 11, boxY + 18);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text(String(card.value), boxX + 11, boxY + 38);
        doc.setFont("helvetica", "normal");
        boxX += boxW + 8;
      });

      y = boxY + boxH + 20;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Detailed statistics", margin, y);
      y += 14;
      cards.slice(3).forEach((card) => {
        doc.text(`• ${card.label}: ${card.value}`, margin, y);
        y += 12;
      });

      y += 8;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Recent Projects", margin, y);
      y += 16;

      // Table heading
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setFillColor(247, 248, 250);
      doc.rect(margin, y - 9, 515, 16, "F");
      doc.text("Project Name", margin + 3, y);
      doc.text("Domain", margin + 180, y);
      doc.text("Date Created", margin + 310, y);
      doc.text("Status", margin + 430, y);
      y += 10;
      doc.setFont("helvetica", "normal");

      recentProjects.forEach((project) => {
        if (y > 760) {
          doc.addPage();
          y = 50;
        }
        doc.text(project.projectName, margin + 3, y);
        doc.text(project.domain, margin + 180, y);
        doc.text(project.dateCreated, margin + 310, y);
        doc.text(project.status, margin + 430, y);
        y += 12;
      });

      doc.save(`dashboard-report-${new Date().toISOString()}.pdf`);
    } catch (err) {
      console.error("PDF generation error", err);
      alert("Unable to generate PDF at this time. Please try again later.");
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (chosenFormat === "csv") {
        createCSV();
      } else {
        await createPDF();
      }
    } finally {
      setIsExporting(false);
      setIsExportDialogOpen(false);
    }
  };

  const openDialog = () => setIsExportDialogOpen(true);

  return (
    <AdminPageLayout>
      <div className="flex-1 p-5 md:p-8 space-y-5">
          <Dialog
            open={isExportDialogOpen}
            onOpenChange={setIsExportDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Dashboard Report</DialogTitle>
                <DialogDescription>
                  Choose format and export the content including stats and
                  recent projects.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="export-format"
                    value="csv"
                    checked={chosenFormat === "csv"}
                    onChange={() => setChosenFormat("csv")}
                    className="h-4 w-4"
                  />
                  CSV
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="export-format"
                    value="pdf"
                    checked={chosenFormat === "pdf"}
                    onChange={() => setChosenFormat("pdf")}
                    className="h-4 w-4"
                  />
                  PDF
                </label>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button disabled={isExporting} onClick={handleExport}>
                  {isExporting ? "Exporting..." : "Export"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {isLoading ? (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
              Loading Super Admin dashboard...
            </div>
          ) : error ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
              {error}
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
                <PageHeader
                  title="Admin Super Dashboard"
                  subtitle={`Welcome back${userName ? `, ${userName}` : ""}! Here’s your latest platform summary.`}
                  action={
                    <Button
                      className="h-10 bg-slate-900 text-white hover:bg-slate-800 shrink-0"
                      onClick={openDialog}
                    >
                      Export Data
                    </Button>
                  }
                />
                <StatsGrid stats={cards} />
              </div>
              <RecentProjectsTable projects={recentProjects} />
            </>
          )}
      </div>
    </AdminPageLayout>
  );
}