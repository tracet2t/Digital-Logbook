import React from 'react';
import TaskCalendar from "@/components/calendar";
import { Button } from "antd";

const MentorDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      <header className="w-full bg-white shadow-md py-4 flex justify-between items-center px-6">
        <h1 className="text-xl font-semibold">Mentor Homepage</h1>
      </header>

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
            <Button className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
              Bulk Report
            </Button>
            <Button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Register Student
            </Button>
          </div>
        </div>
        {/* Render the TaskCalendar component */}
        <div >
          <TaskCalendar />
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
