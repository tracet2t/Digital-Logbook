"use client";
import React from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from '@/components/ui/textarea';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  handleSubmit: () => void;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, handleSubmit }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            {/* Student Avatar and Name - Used for identifying student data */}
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="/avatar.png" alt="User Avatar" />
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
              <div>
                {/* Student Name - Used for backend processing */}
                <AlertDialogTitle className="text-lg font-semibold">Sarose</AlertDialogTitle>
                {/* Project Title & Date - Used for record tracking */}
                <p className="text-xs text-gray-500">
                  Project Digital Diary • Submitted: Jan 11, 2025
                </p>
              </div>
            </div>

            {/* Close Button - UI Only */}
            <button onClick={onClose} className="text-gray-500">✖</button>
          </div>
        </AlertDialogHeader>

        <div className="space-y-3">
          {/* Title Textbox - Project title input from the student */}
          <div>
            <h3 className="font-semibold">Title:</h3>
            <p className="bg-gray-100 p-2 rounded-md">
              Designed the complete wireframe for the new system UI.
            </p>
          </div>

          {/* Brief Description Textbox - Contains detailed project description */}
          <div>
            <h3 className="font-semibold">Brief Description:</h3>
            <AlertDialogDescription className="bg-gray-100 p-2 rounded-md">
              Focused on designing the full wireframe for the new system UI, ensuring a structured
              and user-friendly layout. Worked on improving navigation, component placements, and
              overall visual consistency. The new design aims to enhance user experience, making
              the system more intuitive and efficient. Considered usability best practices and
              alignment with project requirements. This wireframe will serve as a blueprint for
              the development phase.
            </AlertDialogDescription>
          </div>

          {/* Feedback Textarea - Allows the reviewer to input comments */}
          <div>
            <h3 className="font-semibold">Provide Feedback</h3>
            <div className="mb-4">
              <Textarea
                placeholder="Enter feedback"
                className="text-black"
              />
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          {/* Reject Button - Triggers database update to mark project as rejected */}
          <AlertDialogAction
            onClick={handleSubmit}
            className="px-3 py-2 w-full text-center">
            Reject
          </AlertDialogAction>

          {/* Approve Button - Triggers database update to mark project as approved */}
          <AlertDialogAction onClick={handleSubmit}
            className="px-3 py-2 w-full text-center"
          >
            Approved
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Popup;
