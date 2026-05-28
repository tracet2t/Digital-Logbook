"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import { TECH_STACK_OPTIONS } from "@/app/student/_constants_tech_stacks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Code2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

interface TechStackInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

function TechStackInput({ value, onChange, disabled }: TechStackInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim();
      if (trimmed && !value.includes(trimmed)) {
        onChange([...value, trimmed]);
      }
      setSearch("");
    },
    [value, onChange],
  );

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      e.preventDefault();
      addTag(search);
    }
  };

  const filtered = TECH_STACK_OPTIONS.filter(
    (opt) =>
      opt.toLowerCase().includes(search.toLowerCase()) && !value.includes(opt),
  );

  const showCustomAdd =
    search.trim() &&
    !TECH_STACK_OPTIONS.some(
      (opt) => opt.toLowerCase() === search.toLowerCase(),
    ) &&
    !value.includes(search.trim());

  return (
    <div className="space-y-2">
      {/* Selected tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <Badge
              key={tag}
              variant="wip"
              className="flex items-center gap-1 pr-1"
            >
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-0.5 rounded-full hover:bg-blue-200 p-0.5"
                >
                  <X size={11} />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* Search / dropdown */}
      {!disabled && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none"
              onClick={() => {
                setOpen(true);
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
            >
              <Code2 size={14} />
              Search or add technology...
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[--radix-popover-trigger-width] p-0"
            align="start"
          >
            <Command shouldFilter={false}>
              <CommandInput
                ref={inputRef}
                placeholder="Search or add technology..."
                value={search}
                onValueChange={setSearch}
                onKeyDown={handleKeyDown}
              />
              <CommandList>
                {showCustomAdd && (
                  <CommandGroup heading="Custom">
                    <CommandItem
                      value={search}
                      onSelect={() => {
                        addTag(search);
                        setOpen(false);
                      }}
                    >
                      Add &ldquo;{search}&rdquo;
                    </CommandItem>
                  </CommandGroup>
                )}
                {filtered.length > 0 && (
                  <CommandGroup heading="Suggestions">
                    {filtered.map((opt) => (
                      <CommandItem
                        key={opt}
                        value={opt}
                        onSelect={() => {
                          addTag(opt);
                          setOpen(false);
                        }}
                      >
                        {opt}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {!showCustomAdd && filtered.length === 0 && (
                  <CommandEmpty>No results found.</CommandEmpty>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}

const activitySchema = z.object({
  workingHours: z.coerce
    .number()
    .min(1, "Working hours must be at least 1")
    .max(12, "Working hours cannot exceed 12"),
  techStack: z.array(z.string()).default([]),
  notes: z.string().max(300, "Notes cannot exceed 300 characters"),
});

type ActivityFormValues = z.infer<typeof activitySchema>;

interface StudentTaskDetailDialogProps {
  open: boolean;
  date: string;
  defaultWorkingHours: number;
  defaultNotes: string;
  defaultTechStack?: string[];
  review: string;
  isEditable: boolean;
  onSubmit: (
    workingHours: number,
    notes: string,
    technologies: string[],
  ) => void;
  onDelete?: () => void;
  canDelete?: boolean;
  isDeleting?: boolean;
  onClose: () => void;
}

const StudentTaskDetailDialog: React.FC<StudentTaskDetailDialogProps> = ({
  open,
  date,
  defaultWorkingHours,
  defaultNotes,
  defaultTechStack,
  review,
  isEditable,
  onSubmit,
  onDelete,
  canDelete = false,
  isDeleting = false,
  onClose,
}) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      workingHours: defaultWorkingHours || 2,
      techStack: defaultTechStack ?? [],
      notes: defaultNotes || "",
    },
  });

  // Re-populate form whenever the dialog opens with new task data
  useEffect(() => {
    if (open) {
      form.reset({
        workingHours: defaultWorkingHours || 2,
        techStack: defaultTechStack ?? [],
        notes: defaultNotes || "",
      });
    }
  }, [open, defaultWorkingHours, defaultNotes, defaultTechStack, form]);

  const handleFormSubmit = form.handleSubmit((data) => {
    onSubmit(data.workingHours, data.notes, data.techStack);
  });

  const handleDeleteClick = () => {
    if (!onDelete || !canDelete) {
      return;
    }

    setDeleteConfirmOpen(true);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="w-[calc(100%-2rem)] max-w-[88vw] max-h-[86vh] overflow-y-auto sm:!max-w-lg sm:max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
          <DialogDescription>
            {isEditable
              ? "Edit your activity for this date."
              : "View your activity details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Date</label>
              <Input type="date" value={date} disabled />
            </div>

            <FormField
              control={form.control}
              name="workingHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Working Hours</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      disabled={!isEditable}
                      placeholder="Enter working hours"
                      min={1}
                      max={12}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="techStack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technology Stack</FormLabel>
                  <FormControl>
                    <TechStackInput
                      value={field.value}
                      onChange={field.onChange}
                      disabled={!isEditable}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter notes"
                      disabled={!isEditable}
                      maxLength={300}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Feedback</label>
              <Textarea
                value={review}
                placeholder="Mentor's Feedback"
                disabled
              />
            </div>
          </form>
        </Form>

        <div className="flex flex-row-reverse gap-2 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          {isEditable && <Button onClick={handleFormSubmit}>Save</Button>}
          {isEditable && canDelete && (
            <Button
              type="button"
              variant="warning"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          )}
        </div>

        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent size="default">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete submitted task?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The selected task will be removed permanently.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="warning"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  onDelete?.();
                }}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
};

export default StudentTaskDetailDialog;
