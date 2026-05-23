"use client";

import { useMonitorPage } from "@/_hooks/monitor/useMonitorPage";

import { AdminPageLayout, PageHeader } from "@/components/admin";
import MonitorMenteeDialog from "@/components/admin/monitor/MonitorMenteeDialog";
import MonitorMentorDialog from "@/components/admin/monitor/MonitorMentorDialog";
import MonitorUserDialog from "@/components/admin/monitor/MonitorUserDialog";
import MonitorFiltersCard from "@/components/monitor/MonitorFiltersCard";
import MonitorLists from "@/components/monitor/MonitorLists";
import MonitorStatsGrid from "@/components/monitor/MonitorStatsGrid";

export default function MonitorPage() {
  const {
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
  } = useMonitorPage();

  return (
    <AdminPageLayout>
      <div className="flex-1 space-y-5 p-5 md:p-8">
        <PageHeader title="Monitor" subtitle="Monitor activities of users." />

        <MonitorStatsGrid stats={stats} />

        <MonitorFiltersCard
          userFilter={userFilter}
          projectFilter={projectFilter}
          userStateFilter={userStateFilter}
          search={search}
          projectOptions={projectOptions}
          onUserFilterChange={setUserFilter}
          onProjectFilterChange={setProjectFilter}
          onUserStateFilterChange={setUserStateFilter}
          onSearchChange={setSearch}
        />

        <MonitorLists
          userFilter={userFilter}
          isLoading={isLoading}
          error={error}
          isMenteeLoading={isMenteeLoading}
          menteeError={menteeError}
          isUsersLoading={isUsersLoading}
          usersError={usersError}
          filteredMentors={filteredMentors}
          filteredMentees={filteredMentees}
          filteredUsers={filteredUsers}
          remindingMentorId={remindingMentorId}
          onRemind={handleRemind}
          onMentorSelect={handleMentorSelect}
          onMenteeSelect={handleMenteeSelect}
          onUserSelect={handleUserSelect}
        />

        <MonitorMenteeDialog
          menteeId={selectedMenteeId}
          open={isMenteeDialogOpen}
          onOpenChange={handleMenteeDialogChange}
        />

        <MonitorUserDialog
          userId={selectedUserId}
          open={isUserDialogOpen}
          onOpenChange={handleUserDialogChange}
        />

        <MonitorMentorDialog
          mentorId={selectedMentorId}
          open={isMentorDialogOpen}
          onOpenChange={handleMentorDialogChange}
        />
      </div>
    </AdminPageLayout>
  );
}
