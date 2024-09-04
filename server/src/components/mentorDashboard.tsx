import React from 'react';
import TaskCalendar from "@/components/calendar";
import { Button } from "@/components/ui/button"

const MentorDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
    <div className="flex gap-2 justify-between">
      <h1>Dashboard</h1>
      <form action="/auth/logout" method="post">
        <button type="submit">Logout</button>
      </form>
    </div>
      <div className="mt-8 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4 px-4">
          <select className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Student Name</option>
            <option>Student Name1</option>
            <option>Student Name2</option>
            {/* Add more options here */}
          </select>

          <div className="flex space-x-4">
            <Button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
              Generate Report
            </Button>
            <Button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
              Bulk Report
            </Button>
            <Button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Register Student
            </Button>
          </div>
        </div>
        {/* Center the TaskCalendar component */}
        <div className='flex justify-center items-center'>
          <TaskCalendar />
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
