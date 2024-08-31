import React from 'react';
import { Button } from '@/components/ui/button'; 
import 'tailwindcss/tailwind.css'; 

const StudentPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
        <p className="mb-4">Welcome to your student dashboard. Here you can manage your activities and view your progress.</p>
        <Button className="bg-blue-500 text-white hover:bg-blue-600">View Activities</Button>
      </div>
    </div>
  );
};

export default StudentPage;
