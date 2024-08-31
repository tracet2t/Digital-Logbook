// pages/mentor.tsx
import React from 'react';
import { Button } from '@/components/ui/button'; 
import { useRouter } from 'next/router';
import 'tailwindcss/tailwind.css'; 

const MentorPage: React.FC = () => {
  const router = useRouter();

  const handleManageStudentsClick = () => {
    router.push('/'); 
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Mentor Dashboard</h1>
        <p className="mb-4">Welcome to your mentor dashboard. Here you can manage your students and view their activities.</p>
        <Button 
          className="bg-green-500 text-white hover:bg-green-600" 
          onClick={handleManageStudentsClick}
        >
          Manage Students
        </Button>
      </div>
    </div>
  );
};

export default MentorPage;
