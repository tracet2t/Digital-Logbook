import type { MonitorMentorCard } from "@/_hooks/admin/useAdminMonitor";
import type { MonitorMenteeCardData } from "@/_hooks/admin/useAdminMonitorMentees";
import type { MonitorUserCardData } from "@/_hooks/admin/useAdminMonitorUsers";

import { Card } from "@/components/ui/card";
import MonitorMenteeCard from "@/components/admin/monitor/MonitorMenteeCard";
import MonitorMentorCard from "@/components/admin/monitor/MonitorMentorCard";
import MonitorUserCard from "@/components/admin/monitor/MonitorUserCard";

interface MonitorListsProps {
  userFilter: string;
  isLoading: boolean;
  error?: Error | null;
  isMenteeLoading: boolean;
  menteeError?: Error | null;
  isUsersLoading: boolean;
  usersError?: Error | null;
  filteredMentors: MonitorMentorCard[];
  filteredMentees: MonitorMenteeCardData[];
  filteredUsers: MonitorUserCardData[];
  remindingMentorId: string | null;
  onRemind: (mentorId: string) => void;
  onMentorSelect: (mentorId: string) => void;
  onMenteeSelect: (menteeId: string) => void;
  onUserSelect: (userId: string) => void;
}

const StatusCard = ({ tone, message }: { tone: string; message: string }) => (
  <Card className={`rounded-xl border-[#e4e7ed] bg-white p-6 text-sm ${tone}`}>
    {message}
  </Card>
);

export default function MonitorLists({
  userFilter,
  isLoading,
  error,
  isMenteeLoading,
  menteeError,
  isUsersLoading,
  usersError,
  filteredMentors,
  filteredMentees,
  filteredUsers,
  remindingMentorId,
  onRemind,
  onMentorSelect,
  onMenteeSelect,
  onUserSelect,
}: MonitorListsProps) {
  return (
    <>
      {isLoading && (
        <StatusCard tone="text-slate-500" message="Loading monitor data..." />
      )}

      {error && <StatusCard tone="text-rose-600" message={error.message} />}

      {userFilter === "mentees" && isMenteeLoading && (
        <StatusCard tone="text-slate-500" message="Loading mentee data..." />
      )}

      {userFilter === "mentees" && menteeError && (
        <StatusCard tone="text-rose-600" message={menteeError.message} />
      )}

      {userFilter === "all" && isUsersLoading && (
        <StatusCard tone="text-slate-500" message="Loading users..." />
      )}

      {userFilter === "all" && usersError && (
        <StatusCard tone="text-rose-600" message={usersError.message} />
      )}

      {!isLoading && !error && userFilter === "mentors" && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {filteredMentors.length === 0 ? (
            <StatusCard
              tone="text-slate-500"
              message="No mentors match the current filters."
            />
          ) : (
            filteredMentors.map((mentor) => (
              <MonitorMentorCard
                key={mentor.id}
                mentor={mentor}
                onRemind={onRemind}
                isReminding={remindingMentorId === mentor.id}
                onSelect={onMentorSelect}
                onMenteeSelect={onMenteeSelect}
              />
            ))
          )}
        </div>
      )}

      {userFilter === "mentees" && !isMenteeLoading && !menteeError && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {filteredMentees.length === 0 ? (
            <StatusCard
              tone="text-slate-500"
              message="No mentees match the current filters."
            />
          ) : (
            filteredMentees.map((mentee) => (
              <MonitorMenteeCard
                key={mentee.id}
                mentee={mentee}
                onSelect={onMenteeSelect}
              />
            ))
          )}
        </div>
      )}

      {userFilter === "all" && !isUsersLoading && !usersError && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {filteredUsers.length === 0 ? (
            <StatusCard
              tone="text-slate-500"
              message="No users match the current filters."
            />
          ) : (
            filteredUsers.map((user) => (
              <MonitorUserCard
                key={user.id}
                user={user}
                onSelect={onUserSelect}
              />
            ))
          )}
        </div>
      )}
    </>
  );
}
