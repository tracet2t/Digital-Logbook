"use client";

import { useState } from "react";

import {
  Beaker,
  Bot,
  CheckCircle,
  Cpu,
  Database,
  FolderOpen,
  Globe,
  Leaf,
  MoreVertical,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AsideSidebar from "@/components/AsideSidebar";

type ProjectStatus = "active" | "pending" | "completed" | "archived";
type ProjectDomain =
  | "Engineering"
  | "Environment"
  | "Healthcare"
  | "Technology"
  | "Science"
  | "Business";

interface Project {
  id: string;
  name: string;
  domain: ProjectDomain;
  mentors: number;
  students: number;
  createdBy: string;
  createdDate: string;
  status: ProjectStatus;
  icon: React.ReactNode;
}

const DOMAIN_ICONS: Record<string, React.ReactNode> = {
  Engineering: <Bot size={18} className="text-[#737373]" />,
  Environment: <Leaf size={18} className="text-[#737373]" />,
  Healthcare: <Database size={18} className="text-[#737373]" />,
  Technology: <Cpu size={18} className="text-[#737373]" />,
  Science: <Beaker size={18} className="text-[#737373]" />,
  Business: <Globe size={18} className="text-[#737373]" />,
};

const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Smart City Analytics",
    domain: "Engineering",
    mentors: 4,
    students: 24,
    createdBy: "Dr. Emily Chen",
    createdDate: "Oct 12, 2023",
    status: "active",
    icon: DOMAIN_ICONS["Engineering"],
  },
  {
    id: "2",
    name: "Carbon Footprint App",
    domain: "Environment",
    mentors: 2,
    students: 10,
    createdBy: "Marcus V.",
    createdDate: "Oct 14, 2023",
    status: "pending",
    icon: DOMAIN_ICONS["Environment"],
  },
  {
    id: "3",
    name: "Health Records DB",
    domain: "Healthcare",
    mentors: 3,
    students: 15,
    createdBy: "Sarah Jenkins",
    createdDate: "Oct 15, 2023",
    status: "active",
    icon: DOMAIN_ICONS["Healthcare"],
  },
  {
    id: "4",
    name: "AI Research Portal",
    domain: "Technology",
    mentors: 5,
    students: 30,
    createdBy: "Dr. Alan Turing",
    createdDate: "Oct 18, 2023",
    status: "completed",
    icon: DOMAIN_ICONS["Technology"],
  },
  {
    id: "5",
    name: "BioSynth Lab",
    domain: "Science",
    mentors: 2,
    students: 8,
    createdBy: "Elena Rossi",
    createdDate: "Oct 20, 2023",
    status: "archived",
    icon: DOMAIN_ICONS["Science"],
  },
  {
    id: "6",
    name: "FinTech Dashboard",
    domain: "Business",
    mentors: 3,
    students: 12,
    createdBy: "Marcus Vane",
    createdDate: "Oct 22, 2023",
    status: "active",
    icon: DOMAIN_ICONS["Business"],
  },
];

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; dotColor: string; textColor: string }
> = {
  active: {
    label: "ACTIVE",
    dotColor: "bg-green-500",
    textColor: "text-green-600",
  },
  pending: {
    label: "PENDING",
    dotColor: "bg-yellow-400",
    textColor: "text-yellow-600",
  },
  completed: {
    label: "COMPLETED",
    dotColor: "bg-blue-500",
    textColor: "text-blue-600",
  },
  archived: {
    label: "ARCHIVED",
    dotColor: "bg-gray-400",
    textColor: "text-gray-500",
  },
};

const ITEMS_PER_PAGE = 3;
const TOTAL_RESULTS = 24;

export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const [domainFilter, setDomainFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filtered = MOCK_PROJECTS.filter((p) => {
    const domainMatch = domainFilter === "all" || p.domain === domainFilter;
    const statusMatch = statusFilter === "all" || p.status === statusFilter;
    return domainMatch && statusMatch;
  });

  const totalPages = Math.ceil(TOTAL_RESULTS / ITEMS_PER_PAGE);
  const displayedProjects = filtered.slice(0, ITEMS_PER_PAGE);

  return (
    <div className="flex min-h-screen bg-[#f1f1f9]">
      <AsideSidebar />

      <div className="flex-1 p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#0A0A0A]">Projects</h1>
          <Button className="bg-[#0A0A0A] text-white hover:bg-[#333] flex items-center gap-2">
            + Create New Project
          </Button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-[#737373]">Total Projects</p>
              <p className="text-3xl font-bold text-[#0A0A0A]">24</p>
            </div>
            <FolderOpen className="text-[#737373]" size={28} />
          </Card>
          <Card className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-[#737373]">Active Projects</p>
              <p className="text-3xl font-bold text-[#0A0A0A]">18</p>
            </div>
            <CheckCircle className="text-green-500" size={28} />
          </Card>
          <Card className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-[#737373]">Total Students</p>
              <p className="text-3xl font-bold text-[#0A0A0A]">342</p>
            </div>
            <Users className="text-blue-500" size={28} />
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={domainFilter} onValueChange={setDomainFilter}>
            <SelectTrigger className="w-[140px] bg-white border-[#E5E5E5]">
              <SelectValue placeholder="Domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Environment">Environment</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Science">Science</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-white border-[#E5E5E5]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          {(domainFilter !== "all" || statusFilter !== "all") && (
            <Button
              variant="ghost"
              className="text-[#737373] hover:text-[#0A0A0A]"
              onClick={() => {
                setDomainFilter("all");
                setStatusFilter("all");
              }}
            >
              Reset
            </Button>
          )}
        </div>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F5F5]">
                <TableHead className="text-xs font-bold uppercase text-[#737373]">
                  Project Name
                </TableHead>
                <TableHead className="text-xs font-bold uppercase text-[#737373]">
                  Domain
                </TableHead>
                <TableHead className="text-xs font-bold uppercase text-[#737373]">
                  Mentors
                </TableHead>
                <TableHead className="text-xs font-bold uppercase text-[#737373]">
                  Students
                </TableHead>
                <TableHead className="text-xs font-bold uppercase text-[#737373]">
                  Created By
                </TableHead>
                <TableHead className="text-xs font-bold uppercase text-[#737373]">
                  Created Date
                </TableHead>
                <TableHead className="text-xs font-bold uppercase text-[#737373]">
                  Status
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedProjects.map((project) => {
                const statusConfig = STATUS_CONFIG[project.status];
                return (
                  <TableRow key={project.id} className="hover:bg-[#F5F5F5]">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#F0F0F0] shrink-0">
                          {project.icon}
                        </div>
                        <span className="font-semibold text-[#0A0A0A]">
                          {project.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#EBEBEB] text-[#0A0A0A]">
                        {project.domain}
                      </span>
                    </TableCell>
                    <TableCell className="text-[#0A0A0A] font-medium">
                      {project.mentors}
                    </TableCell>
                    <TableCell className="text-[#0A0A0A] font-medium">
                      {project.students}
                    </TableCell>
                    <TableCell className="text-[#0A0A0A] font-semibold">
                      {project.createdBy}
                    </TableCell>
                    <TableCell className="text-[#737373]">
                      {project.createdDate}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${statusConfig.dotColor}`}
                        />
                        <span
                          className={`text-xs font-bold ${statusConfig.textColor}`}
                        >
                          {statusConfig.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#737373] hover:text-[#0A0A0A]"
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === project.id ? null : project.id,
                            )
                          }
                        >
                          <MoreVertical size={16} />
                        </Button>
                        {openMenuId === project.id && (
                          <div className="absolute right-0 top-9 z-50 min-w-[160px] rounded-md border border-[#E5E5E5] bg-white shadow-md py-1">
                            <button
                              className="w-full px-3 py-2 text-left text-sm text-[#0A0A0A] hover:bg-[#F5F5F5]"
                              onClick={() => setOpenMenuId(null)}
                            >
                              View Details
                            </button>
                            <button
                              className="w-full px-3 py-2 text-left text-sm text-[#0A0A0A] hover:bg-[#F5F5F5]"
                              onClick={() => setOpenMenuId(null)}
                            >
                              Edit Project
                            </button>
                            <button
                              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-[#F5F5F5]"
                              onClick={() => setOpenMenuId(null)}
                            >
                              Archive Project
                            </button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E5E5]">
            <p className="text-sm text-[#737373]">
              Showing{" "}
              <span className="font-semibold text-[#0A0A0A]">
                {(page - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[#0A0A0A]">
                {Math.min(page * ITEMS_PER_PAGE, TOTAL_RESULTS)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#0A0A0A]">
                {TOTAL_RESULTS}
              </span>{" "}
              results
            </p>
            <Pagination className="w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  />
                </PaginationItem>
                {[1, 2, 3].map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={page === p}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {totalPages > 4 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </Card>
      </div>
    </div>
  );
}
