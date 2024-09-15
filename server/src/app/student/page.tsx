'use client';

import { Button } from '@/components/ui/button'; 
import React, { useState, useEffect } from 'react';
import { getSessionOnClient } from "@/server_actions/getSession";
import 'tailwindcss/tailwind.css'; 
import TaskCalendar from "@/components/calendar";
import Image from "next/image";
import  { Avatar, AvatarFallback, AvatarImage }  from "@/components/ui/avatar"


const StudentPage: React.FC = () => {
  const [session, setSession] = useState(null);
  const [mentorName, setMentorName] = useState<string | null>(null);
  const [mentorId, setMentorId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  useEffect(() => {
    getSessionOnClient()
      .then((data) => {
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
    <div className="gap-5 flex flex-col bg-[#f1f1f9] min-h-screen">
      {/* Top Bar with Logo, Avatar, and Logout */}
      <div className="flex gap-1 justify-between items-center p-4 bg-gradient-to-t from-blue-50 via-blue-75 to-blue-100 shadow-md h-[10vh] w-full max-w-[95vw] mx-auto mt-[15px] rounded-lg">
        
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={40}
          className="mt-[-0px]"
        />

       <div className="flex items-center gap-4 mt-[0px] relative mr-[15px]">
        
      {/* Avatar */}
      <div onClick={togglePopup} className="cursor-pointer">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>

      {/* Popup Screen */}
      {isPopupOpen && (
            <div className="absolute top-[100%] right-0 mt-2 bg-gradient-to-t from-blue-100 via-blue-200 to-blue-300 shadow-md shadow-lg p-6 rounded-lg z-50 w-[250px]">
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
              <form action="/auth/logout" method="post" className="mt-4">
                <Button variant="blue" className="w-full border-black">Logout</Button>
              </form>
            </div>
          )}
    </div>
      </div>

      
      <div className="flex-grow flex flex-col items-center justify-center mt-[-15px] w-full max-w-[95vw] mx-auto">
        {/* Center the calendar with rounded corners */}
       <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-[95vw] min-h-[60vh]">
        <div className="flex justify-center items-center w-full">
            <TaskCalendar selectedUser={selectedUser}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
