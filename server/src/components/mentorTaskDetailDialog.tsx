// src/components/MentorTaskDetailDialog.tsx

import React from 'react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input'; 
import { Textarea } from '@/components/ui/textarea'; 

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
  return (
    role === 'mentor' && selectedUser !== studentId && (
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
                  onChange={(e) => setWorkingHours(Number(e.target.value) || 0)}
                  placeholder="Enter working hours"
                />
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-black mb-2">Activity</h3>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter notes"
                disabled={!false}
                className="text-black"
              />
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-black mb-2">Review</h3>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Enter your review here..."
                className="w-full h-32 p-3 border border-gray-300 rounded-md bg-white"
              />
            </div>
          </AlertDialogDescription>
          <AlertDialogFooter className="flex justify-end gap-3 mt-4">
            <AlertDialogCancel onClick={setTaskModalOpen} className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-md">Close</AlertDialogCancel>
            <AlertDialogAction onClick={() => {setStatus('approved');}} className="bg-blue-500 text-white hover:bg-blue-700 px-4 py-2 rounded-md">Accept</AlertDialogAction>
            <AlertDialogAction onClick={() => {setStatus('rejected');}} className="bg-red-500 text-white hover:bg-red-700 px-4 py-2 rounded-md">Reject</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  );
};

export default MentorTaskDetailDialog;
