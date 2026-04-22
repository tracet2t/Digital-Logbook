'use client';

import { Button } from '@/components/ui/button'; 
import React, { useState, useEffect } from 'react';
import { getSessionOnClient } from "@/server_actions/getSession";
import TaskCalendar from "@/components/calendar";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SessionData {
  id: string;
  fname: string;
  lname: string;
  email: string;
}

const StudentPage: React.FC = () => {
  const [session, setSession] = useState<SessionData | null>(null);
  const [mentorName, setMentorName] = useState<string | null>(null);
  const [mentorId, setMentorId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    getSessionOnClient()
      .then((data: SessionData | null) => {
        if (data) {
          setSession(data);
          setMentorName(`${data.fname} ${data.lname}`);
          setMentorId(data.id);
          setSelectedUser(data.id); 
        }
      })
      .catch((error) => {
        console.error('Error fetching session:', error);
      });
  }, []);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className="flex min-h-screen flex-col gap-3 bg-[#f1f1f9] px-3 py-3 sm:gap-5 sm:px-0 sm:py-0">
      {/* Top Bar with Logo, Avatar, and Logout */}
      <div className="mx-auto mt-1 flex w-full max-w-[95vw] items-center justify-between gap-2 rounded-lg bg-gradient-to-t from-blue-50 via-blue-75 to-blue-100 px-3 py-3 shadow-md sm:mt-[15px] sm:gap-4 sm:p-4">
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={40}
          className="h-auto w-[140px] sm:w-[180px] md:w-[200px]"
        />

        <div className="relative flex items-center gap-3 sm:mr-[15px] sm:gap-4">
          {/* Avatar */}
          <div onClick={togglePopup} className="cursor-pointer">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

          {/* Popup Screen */}
          {isPopupOpen && (
            <div className="absolute right-0 top-[100%] z-50 mt-2 w-[min(250px,85vw)] rounded-lg bg-gradient-to-t from-blue-100 via-blue-200 to-blue-300 p-4 shadow-lg sm:p-6">
              {/* Large Avatar */}
              <div className="flex justify-center mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>

              {/* Student Name and Email */}
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  {session ? `${session.fname} ${session.lname}` : 'Loading...'}
                </h3>
                <p className="text-xs text-gray-500">
                  {session ? session.email : 'Loading...'}
                </p>
              </div>
              
              {/* Logout Button */}
              <form action="/api/logout" method="post" className="mt-4">
                <Button variant="blue" className="w-full border-black">Logout</Button>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[95vw] flex-1 flex-col items-center justify-start pb-2 sm:justify-center sm:pb-0">
        {/* Center the calendar with rounded corners */}
        <div className="w-full max-w-[95vw] rounded-xl bg-white p-3 shadow-lg sm:p-4">
          <div className="flex w-full items-center justify-center overflow-x-auto">
            <TaskCalendar selectedUser={selectedUser || ""}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
