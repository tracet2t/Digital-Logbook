"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { ApiUserRecord, UserRecord, UserRole, UserStatus } from "./types";
import { mapApiUserToRecord } from "./utils";

const ITEMS_PER_PAGE = 5;

export function useUsersAdmin() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [batchFilter, setBatchFilter] = useState<"all" | string>("all");
  const [page, setPage] = useState(1);

  const [viewUser, setViewUser] = useState<UserRecord | null>(null);
  const [statusUser, setStatusUser] = useState<UserRecord | null>(null);
  const [pendingStatus, setPendingStatus] = useState<UserStatus>("Active");
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  // Fetch users with TanStack Query
  const {
    data: users = [],
    isLoading,
    error: fetchError,
  } = useQuery<UserRecord[], Error>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users", { cache: "no-store" });

      if (!response.ok) {
        const payload = await response
          .json()
          .catch(() => ({ message: "Failed to fetch users" }));
        throw new Error(payload.message ?? "Failed to fetch users");
      }

      const data = (await response.json()) as ApiUserRecord[];
      return data.map(mapApiUserToRecord);
    },
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true, // Always refetch on mount
  });

  // Change status mutation
  const changeStatusMutation = useMutation<
    { id: string; isActive: boolean },
    Error,
    { id: string; isActive: boolean }
  >({
    mutationFn: async ({ id, isActive }) => {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to update status");
      }

      return res.json();
    },
    onSuccess: async (_data, variables) => {
      const newStatus = variables.isActive ? "active" : "inactive";

      // Force immediate refetch (not just invalidate)
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["admin-users"] }),
        queryClient.refetchQueries({ queryKey: ["mentors"] }),
        queryClient.refetchQueries({ queryKey: ["onboarding-applications"] }),
      ]);

      toast.success(`User status changed to ${newStatus} successfully`);

      // Close dialog after refetch completes
      setStatusUser(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update status");
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation<void, Error, string>({
    mutationFn: async (userId) => {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to delete user");
      }
    },
    onSuccess: async () => {
      // Force immediate refetch
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["admin-users"] }),
        queryClient.refetchQueries({ queryKey: ["mentors"] }),
        queryClient.refetchQueries({ queryKey: ["onboarding-applications"] }),
      ]);

      toast.success("User deleted successfully");

      // Close dialog after refetch completes
      setDeleteUserId(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });

  const handleChangeStatus = () => {
    if (!statusUser) return;

    changeStatusMutation.mutate({
      id: statusUser.id,
      isActive: pendingStatus === "Active",
    });
  };

  const handleDeleteUser = () => {
    if (!deleteUserId) return;
    deleteUserMutation.mutate(deleteUserId);
  };

  const openStatusDialog = (user: UserRecord) => {
    setStatusUser(user);
    setPendingStatus(user.status === "Active" ? "Inactive" : "Active");
  };

  const batchOptions = useMemo(() => {
    const seen = new Set<string>();
    for (const u of users) {
      if (u.batchNo) seen.add(u.batchNo);
    }
    return Array.from(seen).sort();
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const isRoleMatch = roleFilter === "all" || user.role === roleFilter;
      const isStatusMatch =
        statusFilter === "all" || user.status === statusFilter;
      const isBatchMatch =
        batchFilter === "all" ||
        (batchFilter === "__none__"
          ? !user.batchNo
          : user.batchNo === batchFilter);
      const query = search.trim().toLowerCase();
      const isSearchMatch =
        query.length === 0 ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query);

      return isRoleMatch && isStatusMatch && isBatchMatch && isSearchMatch;
    });
  }, [users, roleFilter, statusFilter, batchFilter, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleUsers = filteredUsers.slice(startIndex, endIndex);

  return {
    constants: { ITEMS_PER_PAGE },
    filters: {
      search,
      roleFilter,
      statusFilter,
      batchFilter,
      batchOptions,
      page,
      setSearch,
      setRoleFilter,
      setStatusFilter,
      setBatchFilter,
      setPage,
    },
    table: {
      isLoading,
      fetchError: fetchError?.message || null,
      visibleUsers,
      totalUsers: filteredUsers.length,
      totalPages,
      safePage,
    },
    dialogs: {
      viewUser,
      setViewUser,
      statusUser,
      setStatusUser,
      pendingStatus,
      setPendingStatus,
      deleteUserId,
      setDeleteUserId,
      isMutating:
        changeStatusMutation.isPending || deleteUserMutation.isPending,
    },
    actions: {
      openStatusDialog,
      handleChangeStatus,
      handleDeleteUser,
    },
  };
}
