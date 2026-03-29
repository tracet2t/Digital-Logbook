// src/components/MentorTaskDetailDialog.tsx
"use client";

import React, { useEffect, useState } from "react";

import {
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface MentorTaskDetailDialogProps {
  taskModalOpen: boolean;
  setTaskModalOpen: (open: boolean) => void;
  role: string;
  selectedUser: string;
  studentId: string;
  formData: { date: string };
  workingHours: number;
  setWorkingHours: (hours: number) => void;
  notes: string;
  setNotes: (notes: string) => void;
  review: string;
  setReview: (review: string) => void;
  setStatus: (status: string) => void;
  handleClose: () => void;
}
const MentorTaskDetailDialog: React.FC<MentorTaskDetailDialogProps> = ({
  taskModalOpen,
  setTaskModalOpen,
  role,
  selectedUser,
  studentId,
  formData,
  workingHours,
  setWorkingHours,
  notes,
  setNotes,
  review,
  setReview,
  setStatus,
}) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showHoursToast, setShowHoursToast] = useState(false);

  const handleTextChange = (value: string, setter: (value: string) => void) => {
    if (value.length > 300) {
      setShowToast(true);
      setToastMessage("This is not allowed, maximum length is 300 characters.");
    } else {
      setter(value);
    }
  };

  const handleValidationAndAction = (action: string) => {
    if (!notes || !workingHours) {
      setShowToast(true);
      setToastMessage(
        "Notes and Working Hours must be provided before accepting or rejecting.",
      );
      return;
    }
    setStatus(action);
    setTaskModalOpen(false); // Close modal after setting the status
  };

  const handleWorkingHoursBlur = () => {
    if (workingHours === 0) {
      setShowHoursToast(true);
      setWorkingHours(1);
    }
  };

  // Clear review each time the dialog opens so it's never pre-filled
  useEffect(() => {
    if (taskModalOpen) {
      setReview("");
    }
  }, [taskModalOpen, setReview]);

  return (
    role === "mentor" &&
    selectedUser !== studentId && (
      <>
        <Dialog open={taskModalOpen} onOpenChange={setTaskModalOpen}>
          <DialogContent className="sm:max-w-2xl p-0 rounded-2xl overflow-hidden border border-gray-200 shadow-2xl">
            {/* Gradient Header Banner */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5">
              <DialogHeader>
                <DialogTitle className="text-white text-xl font-semibold tracking-tight">
                  Mentor Task Detail
                </DialogTitle>
              </DialogHeader>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5 bg-white">
              {/* Date & Working Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Date
                  </Label>
                  <Input
                    type="date"
                    value={formData.date}
                    disabled
                    className="rounded-xl bg-slate-50 border-slate-200 text-sm text-slate-700 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Working Hours
                  </Label>
                  <Input
                    type="number"
                    value={workingHours}
                    disabled={true}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "") {
                        setWorkingHours(0);
                      } else {
                        const hours = Number(value);
                        if (!isNaN(hours)) {
                          setWorkingHours(Math.max(1, Math.min(12, hours)));
                        } else {
                          setWorkingHours(1);
                        }
                      }
                    }}
                    onBlur={handleWorkingHoursBlur}
                    placeholder="1–12"
                    className="rounded-xl bg-slate-50 border-slate-200 text-sm text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <Separator className="bg-slate-100" />

              {/* Activity */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Activity
                </Label>
                <Textarea
                  value={notes}
                  onChange={(e) => handleTextChange(e.target.value, setNotes)}
                  placeholder="No activity recorded"
                  disabled={true}
                  rows={4}
                  className="rounded-xl bg-slate-50 border-slate-200 text-sm text-slate-700 resize-none cursor-not-allowed"
                />
              </div>

              {/* Review */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Review
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 ml-0.5" />
                </Label>
                <Textarea
                  value={review}
                  onChange={(e) => handleTextChange(e.target.value, setReview)}
                  placeholder="Write your review here…"
                  rows={4}
                  className="rounded-xl bg-white border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 resize-none focus-visible:ring-2 focus-visible:ring-slate-400/40 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            {/* Footer */}
            <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-row items-center justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setTaskModalOpen(false)}
                className="rounded-xl text-slate-600 hover:bg-slate-200 hover:text-slate-800"
              >
                Close
              </Button>
              <Button
                onClick={() => handleValidationAndAction("approved")}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Accept
              </Button>
              <Button
                onClick={() => handleValidationAndAction("rejected")}
                className="rounded-xl bg-red-500 hover:bg-red-600 text-white gap-1.5 shadow-sm"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {showToast && (
          <div className="fixed right-4 top-4 z-50 rounded-md border border-red-200 bg-white px-4 py-3 shadow-lg">
            <p className="text-sm font-semibold text-red-700">Error</p>
            <p className="mt-1 text-sm text-slate-600">{toastMessage}</p>
            <button
              type="button"
              className="mt-2 text-xs text-red-600"
              onClick={() => setShowToast(false)}
            >
              Dismiss
            </button>
          </div>
        )}
        {showHoursToast && (
          <div className="fixed right-4 top-24 z-50 rounded-md border border-amber-200 bg-white px-4 py-3 shadow-lg">
            <p className="text-sm font-semibold text-amber-700">
              Invalid Working Hours
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Please enter a number between 1 and 12 for working hours.
            </p>
            <button
              type="button"
              className="mt-2 text-xs text-amber-700"
              onClick={() => setShowHoursToast(false)}
            >
              Dismiss
            </button>
          </div>
        )}
      </>
    )
  );
};

export default MentorTaskDetailDialog;
