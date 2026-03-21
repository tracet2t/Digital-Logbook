"use client";

import { useEffect, useMemo, useState } from "react";

import { EllipsisVertical, Search } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";

type UserRole = "Student" | "Mentor" | "SuperAdmin";
type UserStatus = "Active" | "Inactive";

type ApiUserRole = "student" | "mentor" | "superAdmin";

interface ApiUserRecord {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: ApiUserRole;
  isActive: boolean;
  createdAt: string;
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  avatar?: string;
}

const ITEMS_PER_PAGE = 5;

function toUserRole(role: ApiUserRole): UserRole {
  if (role === "student") {
    return "Student";
  }
  if (role === "mentor") {
    return "Mentor";
  }
  return "SuperAdmin";
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function mapApiUserToRecord(user: ApiUserRecord): UserRecord {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    role: toUserRole(user.role),
    status: user.isActive ? "Active" : "Inactive",
    createdAt: formatDate(user.createdAt),
  };
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function roleClass(role: UserRole) {
  if (role === "Student") {
    return "bg-slate-100 text-slate-700 border-slate-200";
  }
  if (role === "Mentor") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  return "bg-indigo-50 text-indigo-700 border-indigo-200";
}

function statusClass(status: UserStatus) {
  if (status === "Active") {
    return "text-blue-600";
  }
  return "text-red-500";
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [page, setPage] = useState(1);

  // Modal state
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
      // silently ignore — keep dialog open on error
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
      // silently ignore
    } finally {
      setIsMutating(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const isRoleMatch = roleFilter === "all" || user.role === roleFilter;
      const isStatusMatch =
        statusFilter === "all" || user.status === statusFilter;
      const query = search.trim().toLowerCase();
      const isSearchMatch =
        query.length === 0 ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query);

      return isRoleMatch && isStatusMatch && isSearchMatch;
    });
  }, [users, roleFilter, statusFilter, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleUsers = filteredUsers.slice(startIndex, endIndex);

  const startCount = filteredUsers.length === 0 ? 0 : startIndex + 1;
  const endCount = Math.min(endIndex, filteredUsers.length);

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }
    setPage(nextPage);
  };

  return (
    <>
      <div className="flex min-h-screen bg-[#f5f7fb]">
        <AsideSidebar />

        <div className="flex-1 p-5 md:p-8">
          <Card className="overflow-hidden border-[#d9dde5] bg-white">
            <div className="space-y-4 p-4 md:p-5">
              <div>
                <h1 className="text-page-title text-slate-900">
                  User Administration
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Manage system users, define their platform roles, and monitor
                  account statuses.
                </p>
              </div>

              <div className="flex flex-wrap items-end gap-3 rounded-lg border border-[#e4e7ed] bg-[#f8fafc] p-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    Role
                  </p>
                  <Select
                    value={roleFilter}
                    onValueChange={(value) => {
                      setRoleFilter(value as "all" | UserRole);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 w-[130px] bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Mentor">Mentor</SelectItem>
                      <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    Status
                  </p>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => {
                      setStatusFilter(value as "all" | UserStatus);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 w-[140px] bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="ml-auto w-full sm:w-auto space-y-1">
                  <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    Search
                  </p>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      className="h-8 w-full sm:w-[360px] rounded-lg border border-[#dbe0e8] bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
                      type="search"
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                      }}
                      placeholder="Search by name, email, or ID..."
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-[#e4e7ed]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
                      <TableHead className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        User Identity
                      </TableHead>
                      <TableHead className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Role
                      </TableHead>
                      <TableHead className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Status
                      </TableHead>
                      <TableHead className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Created Date
                      </TableHead>
                      <TableHead className="px-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="px-4 py-8 text-center text-sm text-slate-500"
                        >
                          Loading users...
                        </TableCell>
                      </TableRow>
                    ) : fetchError ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="px-4 py-8 text-center text-sm text-red-500"
                        >
                          {fetchError}
                        </TableCell>
                      </TableRow>
                    ) : visibleUsers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="px-4 py-8 text-center text-sm text-slate-500"
                        >
                          No users found for the selected filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      visibleUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          className="bg-white hover:bg-[#fbfcff]"
                        >
                          <TableCell className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border border-slate-200">
                                {user.avatar ? (
                                  <AvatarImage
                                    src={user.avatar}
                                    alt={user.name}
                                  />
                                ) : null}
                                <AvatarFallback className="bg-slate-100 text-xs font-semibold text-slate-700">
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  {user.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold ${roleClass(user.role)}`}
                            >
                              {user.role}
                            </span>
                          </TableCell>

                          <TableCell className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 text-sm font-medium ${statusClass(user.status)}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${user.status === "Active" ? "bg-blue-500" : "bg-red-500"}`}
                              />
                              {user.status}
                            </span>
                          </TableCell>

                          <TableCell className="px-4 py-3 text-sm text-slate-700">
                            {user.createdAt}
                          </TableCell>

                          <TableCell className="px-4 py-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  type="button"
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                                  aria-label={`Actions for ${user.name}`}
                                >
                                  <EllipsisVertical className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem
                                  onSelect={() => setViewUser(user)}
                                >
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onSelect={() => {
                                    setStatusUser(user);
                                    setPendingStatus(
                                      user.status === "Active"
                                        ? "Inactive"
                                        : "Active",
                                    );
                                  }}
                                >
                                  Change Status
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                  onSelect={() => setDeleteUserId(user.id)}
                                >
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                <div className="flex flex-col gap-3 border-t border-[#e4e7ed] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">
                    Showing {startCount} to {endCount} of {filteredUsers.length}{" "}
                    users
                  </p>

                  <Pagination className="mx-0 w-auto justify-end">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationLink
                          size="icon"
                          onClick={() => goToPage(safePage - 1)}
                          disabled={safePage <= 1}
                          aria-label="Previous page"
                        >
                          {"<"}
                        </PaginationLink>
                      </PaginationItem>

                      {safePage > 2 ? (
                        <>
                          <PaginationItem>
                            <PaginationLink
                              size="icon"
                              isActive={safePage === 1}
                              onClick={() => goToPage(1)}
                            >
                              1
                            </PaginationLink>
                          </PaginationItem>
                          {safePage > 3 ? (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          ) : null}
                        </>
                      ) : null}

                      {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                        .filter(
                          (pageNumber) => Math.abs(pageNumber - safePage) <= 1,
                        )
                        .map((pageNumber) => (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              size="icon"
                              isActive={pageNumber === safePage}
                              onClick={() => goToPage(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                      {safePage < totalPages - 1 ? (
                        <>
                          {safePage < totalPages - 2 ? (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          ) : null}
                          <PaginationItem>
                            <PaginationLink
                              size="icon"
                              isActive={safePage === totalPages}
                              onClick={() => goToPage(totalPages)}
                            >
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      ) : null}

                      <PaginationItem>
                        <PaginationLink
                          size="icon"
                          onClick={() => goToPage(safePage + 1)}
                          disabled={safePage >= totalPages}
                          aria-label="Next page"
                        >
                          {">"}
                        </PaginationLink>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ── View Details Dialog ─────────────────────────────────────────────── */}
      <Dialog
        open={!!viewUser}
        onOpenChange={(open) => !open && setViewUser(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {viewUser != null && (
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border border-slate-200">
                  {viewUser!.avatar ? (
                    <AvatarImage src={viewUser!.avatar} alt={viewUser!.name} />
                  ) : null}
                  <AvatarFallback className="bg-slate-100 text-base font-semibold text-slate-700">
                    {getInitials(viewUser!.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-base font-bold text-slate-900">
                    {viewUser!.name}
                  </p>
                  <p className="text-xs text-slate-500">{viewUser!.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Role
                  </p>
                  <span
                    className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold ${roleClass(viewUser!.role)}`}
                  >
                    {viewUser!.role}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Status
                  </p>
                  <span
                    className={`inline-flex items-center gap-1.5 text-sm font-medium ${statusClass(viewUser!.status)}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${viewUser!.status === "Active" ? "bg-blue-500" : "bg-red-500"}`}
                    />
                    {viewUser!.status}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Created Date
                  </p>
                  <p className="text-slate-700">{viewUser!.createdAt}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-500 mb-1">
                    User ID
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {viewUser!.id}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Change Status Dialog ────────────────────────────────────────────── */}
      <AlertDialog
        open={!!statusUser}
        onOpenChange={(open) => !open && setStatusUser(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Status</AlertDialogTitle>
            <AlertDialogDescription>
              Select the new status for{" "}
              <span className="font-semibold text-slate-900">
                {statusUser?.name}
              </span>
              . Deactivating a user will prevent them from logging in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="px-1 py-2">
            <p className="mb-1.5 text-[11px] font-bold uppercase text-slate-500">
              New Status
            </p>
            <Select
              value={pendingStatus}
              onValueChange={(v) => setPendingStatus(v as UserStatus)}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive (Deactivated)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMutating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isMutating || pendingStatus === statusUser?.status}
              onClick={handleChangeStatus}
            >
              {isMutating ? "Saving…" : "Save"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Delete Confirmation Dialog ──────────────────────────────────────── */}
      <AlertDialog
        open={!!deleteUserId}
        onOpenChange={(open) => !open && setDeleteUserId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user account and all associated
              data — including activities, feedback, reports, badges, and
              project allocations. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isMutating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isMutating}
              onClick={handleDeleteUser}
            >
              {isMutating ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
