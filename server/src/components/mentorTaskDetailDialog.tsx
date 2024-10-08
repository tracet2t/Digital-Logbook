// src/components/MentorTaskDetailDialog.tsx
'use client'
import React, { useState } from 'react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input'; 
import { Button } from '@/components/ui/button'; 
import { Textarea } from '@/components/ui/textarea'; 
import { ToastProvider, Toast, ToastTitle, ToastDescription, ToastClose, ToastViewport } from '@/components/ui/toast'; 

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
  handleClose
}) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
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
      setToastMessage("Notes and Working Hours must be provided before accepting or rejecting.");
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

  return (
    role === 'mentor' && selectedUser !== studentId && (
      <ToastProvider>
        <AlertDialog open={taskModalOpen} onOpenChange={setTaskModalOpen}>
          <AlertDialogTrigger asChild>
            <div />
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-semibold text-gray-900">Mentor Task Detail</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription className="text-gray-700">
              <div className="flex gap-6 mb-4">
                <div className="w-1/2">
                  <span className="block text-sm font-medium text-black mb-1">Date</span>
                  <Input type="date" value={formData.date} disabled className="text-black" />
                </div>
                <div className="w-1/2">
                  <span className="block text-sm font-medium text-black mb-1">Working Hours</span>
                  <Input
                    type="number"
                    value={workingHours}
                    disabled={true}
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
                  />
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-black mb-2">Activity</h3>
                <Textarea
                  value={notes}
                  onChange={(e) => handleTextChange(e.target.value, setNotes)}
                  placeholder="Enter notes"
                  disabled={true}
                  className="text-black"
                />
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-black mb-2">Review</h3>
                <textarea
                  value={review}
                  onChange={(e) => handleTextChange(e.target.value, setReview)}
                  placeholder="Enter your review here..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-md bg-white"
                />
              </div>
            </AlertDialogDescription>
            <AlertDialogFooter className="flex justify-end gap-3 mt-4">
              <Button onClick={() => setTaskModalOpen(false)} className=" text-white  bg[#666668] px-4 py-2 rounded-md">Close</Button>
              <Button
                onClick={() => handleValidationAndAction('approved')}
                className="bg-green-500 text-white hover:bg-green-700 px-4 py-2 rounded-md"
              >
                Accept
              </Button>
              <Button
                onClick={() => handleValidationAndAction('rejected')}
                className="bg-red-500 text-white hover:bg-red-700 px-4 py-2 rounded-md"
              >
                Reject
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {showToast && (
          <Toast onOpenChange={setShowToast} open={showToast}>
            <ToastTitle>Error</ToastTitle>
            <ToastDescription>{toastMessage}</ToastDescription>
            <ToastClose />
          </Toast>
        )}
        {showHoursToast && (
          <Toast>
            <ToastTitle>Invalid Working Hours</ToastTitle>
            <ToastDescription>Please enter a number between 1 and 12 for working hours.</ToastDescription>
            <ToastClose onClick={() => setShowHoursToast(false)} />
            </Toast>
          )}
        <ToastViewport />
      </ToastProvider>
    )
  );
};

export default MentorTaskDetailDialog;

