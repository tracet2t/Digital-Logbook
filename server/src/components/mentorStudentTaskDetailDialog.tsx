// src/components/MentorStudentTaskDetailDialog.tsx
'use client';
import React, { useState } from 'react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input'; 
import { Textarea } from '@/components/ui/textarea'; 
import { Toast, ToastProvider, ToastViewport, ToastTitle, ToastDescription, ToastClose } from '@/components/ui/toast';

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
      setNotes('');
    }
    setNotes(newNotes.substring(0, 300)); // Limit to 300 characters
  };

  const handleWorkingHoursBlur = () => {
    if (workingHours === 0) {
      setShowHoursToast(true);
      setWorkingHours(1);
    }
  };

  return (
    <>
      {role === 'mentor' && selectedUser === studentId && (
        <AlertDialog open={taskModalOpen} onOpenChange={setTaskModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Task Details</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              <form>
                <div className="mb-4">
                  <label>Date</label>
                  <Input type="date" value={formData.date} disabled className="text-black" />
                </div>

                <div className="mb-4">
                  <label>Working Hours</label>
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
                  placeholder="Enter working hours"
                  disabled={!isEditable}
                  className="text-black"
                />
                </div>
                <div className="mb-4">
                  <label>Notes</label>
                  <Textarea
                    value={notes}
                    onChange={handleNotesChange}
                    placeholder="Enter notes"
                    disabled={!isEditable}
                    className="text-black"
                  />
                </div>
              </form>
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
              {isEditable && <AlertDialogAction onClick={handleSubmit}>Save</AlertDialogAction>}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Toast Notification */}
      <ToastProvider>
        <ToastViewport />
        {showToast && (
          <Toast>
            <ToastTitle>Note Length Exceeded</ToastTitle>
            <ToastDescription>The notes cannot exceed 300 characters.</ToastDescription>
            <ToastClose onClick={() => setShowToast(false)} />
          </Toast>
        )}
        {showHoursToast && (
          <Toast>
            <ToastTitle>Invalid Working Hours</ToastTitle>
            <ToastDescription>Please enter a number between 1 and 12 for working hours.</ToastDescription>
            <ToastClose onClick={() => setShowHoursToast(false)} />
            </Toast>
          )}
      </ToastProvider>
    </>
  );
};

export default MentorStudentTaskDetailDialog;
