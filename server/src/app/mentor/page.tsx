// app/mentor/page.tsx
'use client'; // This file needs to use some client-side logic for pop-up control

import { useState } from 'react';
import MentorRegStudentForm from '@/components/mentorregstudentform';
import { Button } from '@/components/ui/button';

export default function MentorPage() {
  const [showForm, setShowForm] = useState(false);

  const handleOpenForm = () => {
    setShowForm(true); // Show the form when the button is clicked
  };

  const handleCloseForm = () => {
    setShowForm(false); // Hide the form when closing action is triggered
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mentor Dashboard</h1>
      <button 
        onClick={handleOpenForm} 
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        Register Student
      </button>

      {/* Render the form conditionally based on showForm state */}
      {showForm && <MentorRegStudentForm />}
    </div>
  );
}