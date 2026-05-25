/**
 * ProjectFormDialog.tsx
 * Reusable dialog for both creating and editing a project.
 */

"use client";

import { useRef, useState } from "react";

import {
  DOMAIN_LABELS,
  DOMAIN_OPTIONS,
  type ProjectFormValues,
} from "@/app/admin/projects/_constants";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

interface ProjectFormDialogProps {
  open: boolean;
  title: string;
  form: ProjectFormValues;
  saving: boolean;
  saveLabel: string;
  savingLabel: string;
  nameError?: string;
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
  nameError,
  onFormChange,
  onSave,
  onClose,
}: ProjectFormDialogProps) {
  const canSave =
    form.name.trim().length > 0 && form.domain.trim().length > 0 && !nameError;

  const [domainOpen, setDomainOpen] = useState(false);
  const [domainSearch, setDomainSearch] = useState("");
  const domainInputRef = useRef<HTMLInputElement>(null);

  const normalizedDomainSearch = domainSearch.trim();
  const domainSuggestions = DOMAIN_OPTIONS.map((d) => DOMAIN_LABELS[d]);
  const filteredDomains = domainSuggestions.filter((opt) =>
    opt.toLowerCase().includes(domainSearch.toLowerCase()),
  );
  const canAddCustomDomain =
    normalizedDomainSearch.length > 0 &&
    !domainSuggestions.some(
      (opt) => opt.toLowerCase() === normalizedDomainSearch.toLowerCase(),
    );

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
            {nameError && (
              <p className="mt-1 text-[13px] text-red-500">{nameError}</p>
            )}
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
            <Popover open={domainOpen} onOpenChange={setDomainOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    setDomainOpen(true);
                    setTimeout(() => domainInputRef.current?.focus(), 0);
                  }}
                >
                  <span className="truncate text-left">
                    {form.domain.trim()
                      ? form.domain
                      : "Search or add domain..."}
                  </span>
                  <span className="text-xs text-muted-foreground">▼</span>
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[--radix-popover-trigger-width] p-0"
                align="start"
              >
                <Command shouldFilter={false}>
                  <CommandInput
                    ref={domainInputRef}
                    placeholder="Search or add domain..."
                    value={domainSearch}
                    onValueChange={setDomainSearch}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && normalizedDomainSearch) {
                        e.preventDefault();
                        onFormChange({
                          ...form,
                          domain: normalizedDomainSearch,
                        });
                        setDomainOpen(false);
                        setDomainSearch("");
                      }
                    }}
                  />
                  <CommandList>
                    {canAddCustomDomain && (
                      <CommandGroup heading="Custom">
                        <CommandItem
                          value={normalizedDomainSearch}
                          onSelect={() => {
                            onFormChange({
                              ...form,
                              domain: normalizedDomainSearch,
                            });
                            setDomainOpen(false);
                            setDomainSearch("");
                          }}
                        >
                          Add "{normalizedDomainSearch}"
                        </CommandItem>
                      </CommandGroup>
                    )}
                    {filteredDomains.length > 0 && (
                      <CommandGroup heading="Suggestions">
                        {filteredDomains.map((opt) => (
                          <CommandItem
                            key={opt}
                            value={opt}
                            onSelect={() => {
                              onFormChange({ ...form, domain: opt });
                              setDomainOpen(false);
                              setDomainSearch("");
                            }}
                          >
                            {opt}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                    {!canAddCustomDomain && filteredDomains.length === 0 && (
                      <CommandEmpty>No results found.</CommandEmpty>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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
            disabled={saving || !canSave}
          >
            {saving ? savingLabel : saveLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
