"use client";

import { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const DOMAINS = [
  { value: "software", label: "Software" },
  { value: "film", label: "Film" },
  { value: "training", label: "Training" },
  { value: "research", label: "Research" },
  { value: "other", label: "Other" },
] as const;

export interface ProjectFormState {
  name: string;
  description: string;
  domain: string;
  batchNo: string;
}

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ProjectFormState;
  onFormChange: Dispatch<SetStateAction<ProjectFormState>>;
  onSubmit: () => void;
  isPending: boolean;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  form,
  onFormChange,
  onSubmit,
  isPending,
}: CreateProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onOpenChange(false)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Project Name</Label>
            <Input
              value={form.name}
              onChange={(e) =>
                onFormChange((f) => ({ ...f, name: e.target.value }))
              }
              placeholder="Enter project name"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Description (optional)</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                onFormChange((f) => ({ ...f, description: e.target.value }))
              }
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Domain</Label>
            <Select
              value={form.domain}
              onValueChange={(v) => onFormChange((f) => ({ ...f, domain: v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOMAINS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Batch No (optional)</Label>
            <Input
              value={form.batchNo}
              onChange={(e) =>
                onFormChange((f) => ({ ...f, batchNo: e.target.value }))
              }
              placeholder="e.g. Batch - 04"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="bg-[#000053] text-white hover:bg-[#000053]"
            disabled={isPending || !form.name.trim()}
            onClick={onSubmit}
          >
            {isPending ? "Creating…" : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
