/**
 * @file ProfileHeader — avatar, name, email, batch info, projects, and status badge.
 */

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ProfileData {
  fullName: string;
  email: string;
  isActive: boolean;
  batchNo: string | null;
}

interface ProfileHeaderProps {
  profile: ProfileData;
  projectNames: string;
}

/**
 * Returns up-to-2-character uppercase initials from a full name.
 */
function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Header section of the shared profile card — avatar, name, email,
 * active/inactive badge, batch info, and assigned projects.
 */
export function ProfileHeader({ profile, projectNames }: ProfileHeaderProps) {
  return (
    <div className="border-b border-[#E5E5E5] px-4 py-5">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-5">
        <Avatar className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border border-slate-200 shadow-sm">
          <AvatarFallback className="bg-[#000053] text-base sm:text-lg font-bold text-white">
            {getInitials(profile.fullName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <div className="text-center sm:text-left">
              <h1 className="font-inter text-xl sm:text-2xl font-extrabold leading-7 tracking-[-0.025em] text-[#0F172A] uppercase break-words">
                {profile.fullName.toUpperCase()}
              </h1>
              <p className="font-inter text-sm font-medium leading-5 text-[#64748B] break-all">
                {profile.email}
              </p>
            </div>

            <Badge
              className={
                profile.isActive
                  ? "self-center sm:self-start rounded-full border border-[#22C55E] bg-[#DCFCE7] px-3 py-1 font-inter text-[10px] font-bold leading-[15px] tracking-[0.05em] text-black uppercase"
                  : "self-center sm:self-start rounded-full border border-slate-300 bg-slate-100 px-3 py-1 font-inter text-[10px] font-bold leading-[15px] tracking-[0.05em] text-black uppercase"
              }
            >
              {profile.isActive ? "Active Mentee" : "Inactive"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <p className="font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] text-[#94A3B8] uppercase">
                Batch Info
              </p>
              <p className="font-inter text-sm font-semibold leading-5 text-[#334155]">
                {profile.batchNo ?? "—"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] text-[#94A3B8] uppercase">
                Assigned Projects
              </p>
              <p className="font-inter text-sm font-semibold leading-5 text-[#334155] truncate">
                {projectNames}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
