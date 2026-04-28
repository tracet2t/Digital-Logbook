/**
 * ViewProjectDialog.tsx
 * Read-only dialog that displays full details for a selected project.
 */

"use client";

import type { AdminProject } from "@/server_actions/adminProjectActions";
import { Globe } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { DOMAIN_ICONS, DOMAIN_LABELS } from "@/app/admin/projects/_constants";

interface ViewProjectDialogProps {
  project: AdminProject | null;
  onClose: () => void;
}

export default function ViewProjectDialog({
  project,
  onClose,
}: ViewProjectDialogProps) {
  if (!project) return null;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Project Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F0F0F0] shrink-0">
              {DOMAIN_ICONS[project.domain] ?? <Globe size={18} />}
            </div>
            <p className="text-lg font-bold">{project.name}</p>
          </div>

          {project.description && <p>{project.description}</p>}

          {project.batchNo && (
            <p className="text-[12px] font-medium text-indigo-500">
              {project.batchNo}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 py-3 border-t border-b">
            <InfoField label="Domain" value={DOMAIN_LABELS[project.domain]} />
            <InfoField label="Created Date" value={project.createdDate} />
            <InfoField label="Mentors" value={String(project.mentors)} />
            <InfoField label="Mentees" value={String(project.students)} />
          </div>

          <MemberList
            label="Mentors"
            members={project.mentorList}
            avatarClassName="bg-slate-400 text-white"
          />
          <MemberList
            label="Mentees"
            members={project.studentList}
            avatarClassName="bg-slate-300 text-slate-700"
          />

          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">
              Created By
            </p>
            <p className="text-slate-900">{project.createdBy}</p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="bg-[#000053] text-white hover:bg-[#000053] border-none"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Renders a single labelled metadata field (e.g. Domain, Created Date). */
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="font-semibold text-slate-900">{value}</p>
    </div>
  );
}

interface MemberListProps {
  label: string;
  members?: Array<{ id: string; name: string }>;
  avatarClassName: string;
}

/** Renders a list of project members (mentors or mentees) as avatar badges. */
function MemberList({ label, members, avatarClassName }: MemberListProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-slate-500 mb-2">
        {label} ({members?.length ?? 0})
      </p>
      {members && members.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {members.map((m) => (
            <Badge
              key={m.id}
              className="flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium"
            >
              <span
                className={`flex items-center justify-center w-5 h-5 rounded-full ${avatarClassName} text-[10px] font-bold shrink-0`}
              >
                {m.name.charAt(0).toUpperCase()}
              </span>
              {m.name}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 italic">
          No {label.toLowerCase()} assigned
        </p>
      )}
    </div>
  );
}
