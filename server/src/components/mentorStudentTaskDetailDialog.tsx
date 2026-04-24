"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const activitySchema = z.object({
  workingHours: z.coerce
    .number()
    .min(1, "Working hours must be at least 1")
    .max(12, "Working hours cannot exceed 12"),
  notes: z.string().max(300, "Notes cannot exceed 300 characters"),
});

type ActivityFormValues = z.infer<typeof activitySchema>;

interface MentorStudentTaskDetailDialogProps {
  open: boolean;
  date: string;
  defaultWorkingHours: number;
  defaultNotes: string;
  isEditable: boolean;
  onSubmit: (workingHours: number, notes: string) => void;
  onClose: () => void;
}

const MentorStudentTaskDetailDialog: React.FC<
  MentorStudentTaskDetailDialogProps
> = ({
  open,
  date,
  defaultWorkingHours,
  defaultNotes,
  isEditable,
  onSubmit,
  onClose,
}) => {
  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      workingHours: defaultWorkingHours || 2,
      notes: defaultNotes || "",
    },
  });

  const handleFormSubmit = form.handleSubmit((data) => {
    onSubmit(data.workingHours, data.notes);
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="w-[calc(100%-1rem)] max-w-md sm:!max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Task Details
          </DialogTitle>
          <DialogDescription>
            {isEditable
              ? "Edit your activity for this date."
              : "View your activity details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Date
                </label>
                <Input type="date" value={date} disabled />
              </div>

              <FormField
                control={form.control}
                name="workingHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Working Hours
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        disabled={!isEditable}
                        placeholder="1–12"
                        min={1}
                        max={12}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-xs font-semibold uppercase tracking-wide">
                      Notes
                    </FormLabel>
                    <span className="text-xs text-muted-foreground">
                      {field.value.length}/300
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter notes here…"
                      disabled={!isEditable}
                      rows={4}
                      maxLength={300}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="flex flex-row-reverse gap-2 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          {isEditable && (
            <Button onClick={handleFormSubmit}>Save changes</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MentorStudentTaskDetailDialog;
