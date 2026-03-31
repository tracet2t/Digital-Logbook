"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

interface StudentTaskDetailDialogProps {
  open: boolean;
  date: string;
  defaultWorkingHours: number;
  defaultNotes: string;
  review: string;
  isEditable: boolean;
  onSubmit: (workingHours: number, notes: string) => void;
  onClose: () => void;
}

const StudentTaskDetailDialog: React.FC<StudentTaskDetailDialogProps> = ({
  open,
  date,
  defaultWorkingHours,
  defaultNotes,
  review,
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
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <AlertDialogContent className="!max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Task Details</AlertDialogTitle>
          <AlertDialogDescription>
            {isEditable
              ? "Edit your activity for this date."
              : "View your activity details."}
          </AlertDialogDescription>
        </AlertDialogHeader>

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

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {isEditable && <Button onClick={handleFormSubmit}>Save</Button>}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StudentTaskDetailDialog;
