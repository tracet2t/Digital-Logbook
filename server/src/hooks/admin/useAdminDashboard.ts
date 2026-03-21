"use client";

import { useEffect, useState } from "react";

export type ProjectStatus = "active" | "pending" | "delayed";

export interface ProjectRow {
  projectName: string;
  domain: string;
  dateCreated: string;
  status: ProjectStatus;
}

export interface AdminStats {
  totalUsers: number;
  students: number;
  mentors: number;
  totalProjects: number;
  pendingInvites: number;
  activeProjects: number;
}

export interface UseAdminDashboardResult {
  stats: AdminStats;
  recentProjects: ProjectRow[];
  isLoading: boolean;
  error: string | null;
}

const initialStats: AdminStats = {
  totalUsers: 0,
  students: 0,
  mentors: 0,
  totalProjects: 0,
  pendingInvites: 0,
  activeProjects: 0,
};

const statusForProject = (project: any): ProjectStatus => {
  const hasPeople = (project?.mentorCount ?? 0) > 0 || (project?.studentCount ?? 0) > 0;
  const createdAt = project?.createdAt ? new Date(project.createdAt) : null;
  const ageDays = createdAt ? Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  if (!hasPeople && ageDays > 45) return "delayed";
  if (!hasPeople) return "pending";
  return "active";
};

export function useAdminDashboard() {
  const [stats, setStats] = useState<AdminStats>(initialStats);
  const [recentProjects, setRecentProjects] = useState<ProjectRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [usersRes, projectsRes, invitesRes] = await Promise.all([
          fetch("/api/admin/users", { cache: "no-store" }),
          fetch("/api/project", { cache: "no-store" }),
          fetch("/api/invitations", { cache: "no-store" }),
        ]);

        if (!usersRes.ok) throw new Error("Failed to load users");
        if (!projectsRes.ok) throw new Error("Failed to load projects");
        if (!invitesRes.ok) throw new Error("Failed to load invitations");

        const usersData = (await usersRes.json()) as Array<{ role: string }>;
        const projectsData = (await projectsRes.json()) as Array<any>;
        const invitationsData = (await invitesRes.json()) as Array<{ status: string }>;

        if (!mounted) return;

        const totalUsers = usersData.length;
        const students = usersData.filter((user) => user.role === "student").length;
        const mentors = usersData.filter((user) => user.role === "mentor").length;

        const totalProjects = projectsData.length;

        const pendingInvites = invitationsData.filter((inv) => inv.status === "Pending").length;

        const activeProjects = projectsData.filter((project) => statusForProject(project) === "active").length;

        const sortedProjects = [...projectsData].sort((a, b) => {
          const aDate = new Date(a.createdAt).getTime();
          const bDate = new Date(b.createdAt).getTime();
          return bDate - aDate;
        });

        const recentProjectsMapped = sortedProjects.slice(0, 6).map((project) => ({
          projectName: project.name || "-",
          domain: project.domain || "-",
          dateCreated: project.createdAt
            ? new Date(project.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })
            : "-",
          status: statusForProject(project),
        }));

        setStats({
          totalUsers,
          students,
          mentors,
          totalProjects,
          pendingInvites,
          activeProjects,
        });

        setRecentProjects(recentProjectsMapped);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  return { stats, recentProjects, isLoading, error };
}
