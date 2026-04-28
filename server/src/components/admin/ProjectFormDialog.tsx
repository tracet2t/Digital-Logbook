/**
 * ProjectFormDialog.tsx
 * Reusable dialog for both creating and editing a project.
 */

"use client";

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

import {
  DOMAIN_LABELS,
  DOMAIN_OPTIONS,
  type ProjectFormValues,
} from "@/app/admin/projects/_constants";

interface ProjectFormDialogProps {
  open: boolean;
  title: string;
  form: ProjectFormValues;
  saving: boolean;
  saveLabel: string;
  savingLabel: string;
  onFormChange: (form: ProjectFormValues) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function ProjectFormDialog({
  open,
  title,
  form,
  saving,
  saveLabel,
  savingLabel,
  onFormChange,
  onSave,
  onClose,
}: ProjectFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Project Name</Label>
            <Input
              value={form.name}
              onChange={(e) => onFormChange({ ...form, name: e.target.value })}
              placeholder="Enter project name"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Description (optional)</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                onFormChange({ ...form, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Domain</Label>
            <Select
              value={form.domain}
              onValueChange={(v) => onFormChange({ ...form, domain: v })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOMAIN_OPTIONS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {DOMAIN_LABELS[d]}
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
                onFormChange({ ...form, batchNo: e.target.value })
              }
              placeholder="e.g. Batch - 04"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={saving}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="bg-[#000053] text-white hover:bg-[#000053]"
            onClick={onSave}
            disabled={saving || !form.name.trim()}
          >
            {saving ? savingLabel : saveLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
