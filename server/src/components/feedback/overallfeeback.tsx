'use client';

import React, { useState } from 'react';
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

interface OverallFeedbackProps {
  onClose: () => void;
  onSave: (feedback: string) => void;
}

const OverallFeedback: React.FC<OverallFeedbackProps> = ({ onClose, onSave }) => {
  const [overallFeedback, setOverallFeedback] = useState('');

  const handleOverallFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOverallFeedback(e.target.value);
  };

  const handleSaveOverallFeedback = () => {
    onSave(overallFeedback);
  };

  return (
    <AlertDialog open onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Overall Feedback</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          <textarea
            value={overallFeedback}
            onChange={handleOverallFeedbackChange}
            placeholder="Provide your overall feedback here"
            rows={6}
            style={{ width: '100%' }}
          />
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
          <AlertDialogAction onClick={handleSaveOverallFeedback}>Save Feedback</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OverallFeedback;
