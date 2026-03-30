"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  XCircle,
} from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const feedbackSchema = z.object({
  review: z
    .string()
    .min(1, "Review is required")
    .max(300, "Review cannot exceed 300 characters"),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

interface MentorTaskDetailDialogProps {
  open: boolean;
  date: string;
  workingHours: number;
  notes: string;
  onSubmit: (review: string, status: "approved" | "rejected") => void;
  onClose: () => void;
}

const MentorTaskDetailDialog: React.FC<MentorTaskDetailDialogProps> = ({
  open,
  date,
  workingHours,
  notes,
  onSubmit,
  onClose,
}) => {
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { review: "" },
  });

  const handleAction = (status: "approved" | "rejected") => {
    form.handleSubmit((data) => {
      onSubmit(data.review, status);
    })();
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <AlertDialogContent className="!max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold">
            Mentor Task Review
          </AlertDialogTitle>
          <AlertDialogDescription>
            Review the student&apos;s activity and provide feedback.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                Date
              </label>
              <Input type="date" value={date} disabled />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Working Hours
              </label>
              <Input type="number" value={workingHours} disabled />
            </div>
          </div>

          <Separator />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Activity
            </label>
            <Textarea
              value={notes}
              disabled
              rows={3}
              placeholder="No activity recorded"
            />
          </div>

          <Form {...form}>
            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Review
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Write your review here…"
                      rows={3}
                      maxLength={300}
                    />
                  </FormControl>
                  <div className="flex justify-between">
                    <FormMessage />
                    <span className="text-xs text-muted-foreground">
                      {field.value.length}/300
                    </span>
                  </div>
                </FormItem>
              )}
            />
          </Form>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <Button
            onClick={() => handleAction("approved")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Accept
          </Button>
          <Button
            onClick={() => handleAction("rejected")}
            variant="destructive"
            className="gap-1.5"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MentorTaskDetailDialog;
