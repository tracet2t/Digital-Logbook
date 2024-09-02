// app/mentor/page.tsx
'use client'; // This file needs to use some client-side logic for pop-up control

import { useState } from 'react';
import MentorRegStudentForm from '@/components/mentorregstudentform';

export default function MentorPage() {
  const [showForm, setShowForm] = useState(false);

  const handleOpenForm = () => {
    setShowForm(true); // Show the form when the button is clicked
  };

  const handleCloseForm = () => {
    setShowForm(false); // Hide the form when closing action is triggered
  };

  return (
    <div>
      <h1>Mentor Dashboard</h1>
      <button onClick={handleOpenForm}>Register Student</button>

      {/* Render the form conditionally based on showForm state */}
      {showForm && <MentorRegStudentForm/>}
    </div>
  );
}
