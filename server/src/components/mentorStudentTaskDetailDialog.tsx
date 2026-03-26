// src/components/MentorStudentTaskDetailDialog.tsx
'use client';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Toast, ToastProvider, ToastViewport, ToastTitle, ToastDescription, ToastClose } from '@/components/ui/toast';
import { CalendarDays, Clock } from 'lucide-react';

interface MentorStudentTaskDetailDialogProps {
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
  isEditable: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
}

const MentorStudentTaskDetailDialog: React.FC<MentorStudentTaskDetailDialogProps> = ({
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
  isEditable,
  handleClose,
  handleSubmit
}) => {
  const [showToast, setShowToast] = useState(false);
  const [showHoursToast, setShowHoursToast] = useState(false);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    if (newNotes.length > 300) {
      setShowToast(true);
    }
    setNotes(newNotes.substring(0, 300));
  };

  const handleWorkingHoursBlur = () => {
    if (workingHours === 0) {
      setShowHoursToast(true);
      setWorkingHours(1);
    }
  };

  const charCount = notes.length;
  const isNearLimit = charCount >= 270;

  return (
    <>
      {role === 'mentor' && selectedUser === studentId && (
        <Dialog open={taskModalOpen} onOpenChange={setTaskModalOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden shadow-xl border-0 bg-white">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 bg-white">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-xl font-semibold text-gray-900">
                    Task Details
                  </DialogTitle>
                  {isEditable && (
                    <Badge variant="secondary" className="text-xs font-medium bg-blue-50 text-blue-600 border-0">
                      Editable
                    </Badge>
                  )}
                </div>
              </DialogHeader>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-5 bg-white">
              {/* Date & Working Hours row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500 flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Date
                  </Label>
                  <Input
                    type="date"
                    value={formData.date}
                    disabled
                    className="text-sm text-gray-700 bg-gray-50 border-gray-200 rounded-lg cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Working Hours
                  </Label>
                  <Input
                    type="number"
                    value={workingHours}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
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
                    disabled={!isEditable}
                    className="text-sm text-gray-700 bg-gray-50 border-gray-200 rounded-lg disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Notes
                  </Label>
                  <span className={`text-xs tabular-nums ${isNearLimit ? 'text-amber-500 font-medium' : 'text-gray-400'}`}>
                    {charCount}/300
                  </span>
                </div>
                <Textarea
                  value={notes}
                  onChange={handleNotesChange}
                  placeholder="Enter notes here…"
                  disabled={!isEditable}
                  rows={4}
                  className="text-sm text-gray-700 bg-gray-50 border-gray-200 rounded-lg resize-none disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Footer */}
            <DialogFooter className="px-6 py-4 border-t border-gray-100 flex flex-row justify-end gap-2 bg-white">
              <Button
                variant="outline"
                onClick={handleClose}
                className="rounded-lg border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              >
                Cancel
              </Button>
              {isEditable && (
                <Button
                  onClick={handleSubmit}
                  className="rounded-lg bg-blue-600 text-white hover:bg-blue-700 px-6"
                >
                  Save changes
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Toast Notifications */}
      <ToastProvider>
        <ToastViewport />
        {showToast && (
          <Toast>
            <ToastTitle>Character limit reached</ToastTitle>
            <ToastDescription>Notes cannot exceed 300 characters.</ToastDescription>
            <ToastClose onClick={() => setShowToast(false)} />
          </Toast>
        )}
        {showHoursToast && (
          <Toast>
            <ToastTitle>Invalid working hours</ToastTitle>
            <ToastDescription>Please enter a value between 1 and 12.</ToastDescription>
            <ToastClose onClick={() => setShowHoursToast(false)} />
          </Toast>
        )}
      </ToastProvider>
    </>
  );
};

export default MentorStudentTaskDetailDialog;
