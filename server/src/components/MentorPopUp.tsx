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
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface MentorPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  mentorDetails: {
    selectedDate: string;
    workingHours: string;
    studentActivity: string;
    review: string;
  };
}

const MentorPopUp: React.FC<MentorPopUpProps> = ({ isOpen, onClose, mentorDetails }) => {
  const [review, setReview] = useState<string>(mentorDetails.review || '');

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
  };

  const handleAccept = () => {
    console.log("Task Accepted");
    console.log("Review:", review); 
  };

  const handleReject = () => {
    console.log("Task Rejected");
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
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
              <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
                <p>{mentorDetails.selectedDate || 'No date selected'}</p>
              </div>
            </div>
            <div className="w-1/2">
              <span className="block text-sm font-medium text-black mb-1">Working Hours</span>
              <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
                <p>{mentorDetails.workingHours || 'No working hours'}</p>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-black mb-2">Activity</h3>
            <div className="p-3 border border-gray-300 rounded-md bg-gray-50 min-h-[120px] overflow-auto">
              <p>{mentorDetails.studentActivity || ''}</p>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-black mb-2">Review</h3>
            <textarea
              value={review}
              onChange={handleReviewChange}
              placeholder="Enter your review here..."
              className="w-full h-32 p-3 border border-gray-300 rounded-md bg-white"
            />
          </div>
        </AlertDialogDescription>
        <AlertDialogFooter className="flex justify-end gap-3 mt-4">
          <AlertDialogCancel onClick={onClose} className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-md">Close</AlertDialogCancel>
          <AlertDialogAction onClick={handleAccept} className="bg-blue-500 text-white hover:bg-blue-700 px-4 py-2 rounded-md">Accept</AlertDialogAction>
          <AlertDialogAction onClick={handleReject} className="bg-red-500 text-white hover:bg-red-700 px-4 py-2 rounded-md">Reject</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const sampleMentorDetails = {
  selectedDate: "2024-09-05",
  workingHours: "3 hours",
  studentActivity: "Completed the project proposal and submitted it for review.",
  review: ""
};

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <MentorPopUp
        isOpen={isModalOpen}
        onClose={handleClose}
        mentorDetails={sampleMentorDetails}
      />
    </div>
  );
};

export default App;
