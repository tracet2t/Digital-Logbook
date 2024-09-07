'use client';

import React, { useState, useEffect } from 'react';
import TaskCalendar from "@/components/calendar";
import { Button } from "@/components/ui/button";
import MentorRegStudentForm from '@/components/mentorregstudentform';
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSessionOnClient } from "@/server_actions/getSession";

const MentorDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState<{ id: string; firstName: string; lastName: string; }[]>([]);
  const [session, setSession] = useState(null);
  const [mentorName, setMentorName] = useState<string | null>(null);
  const [mentorId, setMentorId] = useState<string | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state for users

  useEffect(() => {
    getSessionOnClient()
      .then((data) => {
        setSession(data);
        setMentorName(data.fname + ' ' + data.lname);
        setMentorId(data.id);
        setSelectedMentor(data.id);
      })
      .catch((error) => {
        console.error('Error fetching session:', error);
      });
  }, []);

  const handleOpenForm = () => {
    setShowForm(true); 
  };

  const handleCloseForm = () => {
    setShowForm(false); 
  };

  const handleMentorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMentor(e.target.value); 
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users');
      const data = await response.json();
      setUsers(data);
      setIsLoading(false); // Stop loading once users are fetched
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setIsLoading(false); // Stop loading even if there's an error
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-[#B2D8F1] via-[#B2D8F1_25%] to-[#0A5080_67%]">
      {/* Top Bar with Logo, Avatar, and Logout */}
      <div className="flex gap-4 justify-between items-center p-4">
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={40}
          className="mt-[-70px]"
        />
        <div className="flex items-center gap-4 mt-[-70px]">
          {/* Avatar */}
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          {/* Logout Button */}
          <form action="/auth/logout" method="post">
            <Button>Logout</Button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center mt-[-100px]">
        <div className="bg-white p-4 rounded-xl shadow-lg h-128 w-full max-w-5xl">
          <div className="flex justify-between items-center mb-4 px-4">
            <select
              className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedMentor}
              onChange={handleMentorChange}
              disabled={isLoading} // Disable dropdown while loading
            >
              {isLoading ? (
                <option>Loading...</option> // Show a loading option
              ) : (
                <>
                  <option value={mentorId}>{mentorName}</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </>
              )}
            </select>

            <div className="flex space-x-4">
              <Button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
                Generate Report
              </Button>
              <Button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
                Bulk Report
              </Button>
              <Button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={handleOpenForm}
              >
                Register Student
              </Button>
              {showForm && <MentorRegStudentForm onClose={handleCloseForm} />}
            </div>
          </div>

          {/* Center the TaskCalendar component */}
          <div className="flex justify-center items-center">
            <TaskCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
