// app/mentor/page.tsx
'use client'; // This file needs to use some client-side logic for pop-up control



import { useState } from 'react';
import MentorRegStudentForm from '@/components/mentorregstudentform';
import MentorDashboard from '@/components/mentorDashboard';
export default function MentorPage() {

  

  return (
      <MentorDashboard />
  );
}


