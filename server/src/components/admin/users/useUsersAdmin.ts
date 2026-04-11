import { useEffect, useMemo, useState } from "react";

import { ApiUserRecord, UserRecord, UserRole, UserStatus } from "./types";
import { mapApiUserToRecord } from "./utils";

const ITEMS_PER_PAGE = 5;

export function useUsersAdmin() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [batchFilter, setBatchFilter] = useState<"all" | string>("all");
  const [page, setPage] = useState(1);

  const [viewUser, setViewUser] = useState<UserRecord | null>(null);
  const [statusUser, setStatusUser] = useState<UserRecord | null>(null);
  const [pendingStatus, setPendingStatus] = useState<UserStatus>("Active");
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const loadUsers = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const response = await fetch("/api/admin/users", { cache: "no-store" });
      if (!response.ok) {
        const payload = await response
          .json()
          .catch(() => ({ message: "Failed to fetch users" }));
        throw new Error(payload.message ?? "Failed to fetch users");
      }
      const data = (await response.json()) as ApiUserRecord[];
      setUsers(data.map(mapApiUserToRecord));
    } catch (error) {
      setUsers([]);
      setFetchError(
        error instanceof Error ? error.message : "Failed to fetch users",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchUsers = async () => {
      setIsLoading(true);
      setFetchError(null);

      try {
        const response = await fetch("/api/admin/users", {
          cache: "no-store",
        });

        if (!response.ok) {
          const payload = await response
            .json()
            .catch(() => ({ message: "Failed to fetch users" }));
          throw new Error(payload.message ?? "Failed to fetch users");
        }

        const data = (await response.json()) as ApiUserRecord[];
        if (!mounted) {
          return;
        }

        setUsers(data.map(mapApiUserToRecord));
      } catch (error) {
        if (!mounted) {
          return;
        }
        setUsers([]);
        setFetchError(
          error instanceof Error ? error.message : "Failed to fetch users",
        );
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      mounted = false;
    };
  }, []);

  const handleChangeStatus = async () => {
    if (!statusUser) return;

    setIsMutating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: statusUser.id,
          isActive: pendingStatus === "Active",
        }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      setStatusUser(null);
      await loadUsers();
    } catch {
      // Keep dialog open so the user can retry.
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;

    setIsMutating(true);
    try {
      const res = await fetch(`/api/admin/users?id=${deleteUserId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");

      setDeleteUserId(null);
      await loadUsers();
    } catch {
      // Keep dialog state unchanged on failure.
    } finally {
      setIsMutating(false);
    }
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
      fetchError,
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
      isMutating,
    },
    actions: {
      openStatusDialog,
      handleChangeStatus,
      handleDeleteUser,
    },
  };
}
