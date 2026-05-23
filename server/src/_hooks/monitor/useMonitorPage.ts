"use client";

import { useMemo, useState } from "react";

import {
  useAdminMonitor,
  useAdminMonitorReminder,
} from "@/_hooks/admin/useAdminMonitor";
import { useAdminMonitorMentees } from "@/_hooks/admin/useAdminMonitorMentees";
import { useAdminMonitorUsers } from "@/_hooks/admin/useAdminMonitorUsers";
import { matchesQuery, normalizeQuery } from "@/utils/monitorFormatters";

export const useMonitorPage = () => {
  const [userFilter, setUserFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [userStateFilter, setUserStateFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedMenteeId, setSelectedMenteeId] = useState<string | null>(null);
  const [isMenteeDialogOpen, setIsMenteeDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [isMentorDialogOpen, setIsMentorDialogOpen] = useState(false);
  const [remindingMentorId, setRemindingMentorId] = useState<string | null>(
    null,
  );

  const { data, isLoading, error } = useAdminMonitor();
  const {
    data: menteeData,
    isLoading: isMenteeLoading,
    error: menteeError,
  } = useAdminMonitorMentees();
  const {
    data: usersData,
    isLoading: isUsersLoading,
    error: usersError,
  } = useAdminMonitorUsers();
  const reminderMutation = useAdminMonitorReminder();

  const projectOptions = useMemo(() => {
    const projects = new Set<string>();
    let hasUnassigned = false;

    (usersData ?? []).forEach((user) => {
      if (user.assignedProjects.length === 0) {
        hasUnassigned = true;
      }
      user.assignedProjects.forEach((project) => projects.add(project));
    });

    return {
      projects: Array.from(projects).sort((a, b) => a.localeCompare(b)),
      hasUnassigned,
    };
  }, [usersData]);

  const filteredMentors = useMemo(() => {
    let next = data?.mentors ?? [];

    const query = normalizeQuery(search);
    if (query) {
      next = next.filter(
        (mentor) =>
          matchesQuery(mentor.name, query) ||
          mentor.mentees.some((mentee) => matchesQuery(mentee.name, query)),
      );
    }

    return next;
  }, [data?.mentors, search]);

  const filteredMentees = useMemo(() => {
    let next = menteeData?.mentees ?? [];

    const query = normalizeQuery(search);
    if (query) {
      next = next.filter((mentee) => matchesQuery(mentee.name, query));
    }

    return next;
  }, [menteeData?.mentees, search]);

  const filteredUsers = useMemo(() => {
    let next = usersData ?? [];

    if (userStateFilter !== "all") {
      next = next.filter((user) =>
        userStateFilter === "active" ? user.isActive : !user.isActive,
      );
    }

    if (projectFilter !== "all") {
      next = next.filter((user) => {
        if (projectFilter === "unassigned") {
          return user.assignedProjects.length === 0;
        }

        return user.assignedProjects.includes(projectFilter);
      });
    }

    const query = normalizeQuery(search);
    if (query) {
      next = next.filter(
        (user) =>
          matchesQuery(`${user.firstName} ${user.lastName}`, query) ||
          matchesQuery(user.email, query),
      );
    }

    return next;
  }, [projectFilter, search, userStateFilter, usersData]);

  const stats = data?.stats;

  const handleRemind = (mentorId: string) => {
    setRemindingMentorId(mentorId);
    reminderMutation.mutate(
      { mentorId },
      {
        onSettled: () => setRemindingMentorId(null),
      },
    );
  };

  const handleMenteeSelect = (menteeId: string) => {
    setSelectedMenteeId(menteeId);
    setIsMenteeDialogOpen(true);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    setIsUserDialogOpen(true);
  };

  const handleMentorSelect = (mentorId: string) => {
    setSelectedMentorId(mentorId);
    setIsMentorDialogOpen(true);
  };

  const handleMenteeDialogChange = (open: boolean) => {
    setIsMenteeDialogOpen(open);
    if (!open) {
      setSelectedMenteeId(null);
    }
  };

  const handleUserDialogChange = (open: boolean) => {
    setIsUserDialogOpen(open);
    if (!open) {
      setSelectedUserId(null);
    }
  };

  const handleMentorDialogChange = (open: boolean) => {
    setIsMentorDialogOpen(open);
    if (!open) {
      setSelectedMentorId(null);
    }
  };

  return {
    userFilter,
    projectFilter,
    userStateFilter,
    search,
    setUserFilter,
    setProjectFilter,
    setUserStateFilter,
    setSearch,
    stats,
    isLoading,
    error,
    isMenteeLoading,
    menteeError,
    isUsersLoading,
    usersError,
    projectOptions,
    filteredMentors,
    filteredMentees,
    filteredUsers,
    remindingMentorId,
    handleRemind,
    handleMenteeSelect,
    handleUserSelect,
    handleMentorSelect,
    selectedMenteeId,
    isMenteeDialogOpen,
    selectedUserId,
    isUserDialogOpen,
    selectedMentorId,
    isMentorDialogOpen,
    handleMenteeDialogChange,
    handleUserDialogChange,
    handleMentorDialogChange,
  };
};
