// src/components/StudentTaskDetailDialog.tsx


import React from 'react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input'; 
import { Textarea } from '@/components/ui/textarea'; 


interface StudentTaskDetailDialogProps {
  taskModalOpen: boolean;
  setTaskModalOpen: (open: boolean) => void;
  formData: { date: string };
  workingHours: number;
  role: string;
  setWorkingHours: (hours: number) => void;
  notes: string;
  setNotes: (notes: string) => void;
  isEditable: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
}

const StudentTaskDetailDialog: React.FC<StudentTaskDetailDialogProps> = ({
  taskModalOpen,
  setTaskModalOpen,
  formData,
  workingHours,
  setWorkingHours,
  notes,
  role,
  setNotes,
  isEditable,
  handleClose,
  handleSubmit
}) => {
  return (
    role === 'student' && (
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
                  onChange={(e) => setWorkingHours(Number(e.target.value) || 0)}
                  placeholder="Enter working hours"
                  disabled={!isEditable}
                  className="text-black"
                />
              </div>
              <div className="mb-4">
                <label>Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
    )
  );
};

export default StudentTaskDetailDialog;
