"use client";

import { useMonitorPage } from "@/_hooks/monitor/useMonitorPage";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <Card className="overflow-hidden border-[#d9dde5] bg-white">
          <div className="space-y-5 p-4 md:p-5">
            <PageHeader
              title="Monitor"
              subtitle="Monitor activities of users."
            />

            <div className="flex">
              <Tabs value={userFilter} onValueChange={setUserFilter}>
                <TabsList className="w-fit rounded-xl bg-slate-100 p-1">
                  <TabsTrigger
                    value="all"
                    className="rounded-lg px-5 py-1.5 text-sm font-medium text-slate-500 data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-[#000053] data-[state=active]:shadow-sm"
                  >
                    All users
                  </TabsTrigger>
                  <TabsTrigger
                    value="mentors"
                    className="rounded-lg px-5 py-1.5 text-sm font-medium text-slate-500 data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-[#000053] data-[state=active]:shadow-sm"
                  >
                    Mentors
                  </TabsTrigger>
                  <TabsTrigger
                    value="mentees"
                    className="rounded-lg px-5 py-1.5 text-sm font-medium text-slate-500 data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-[#000053] data-[state=active]:shadow-sm"
                  >
                    Mentees
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <MonitorStatsGrid stats={stats} />

            <MonitorFiltersCard
              userFilter={userFilter}
              projectFilter={projectFilter}
              userStateFilter={userStateFilter}
              search={search}
              projectOptions={projectOptions}
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
          </div>
        </Card>

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
