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

  return (
    <div className="gap-5 flex flex-col bg-[#dee2e6]">
      {/* Top Bar with Logo, Avatar, and Logout */}
      <div className="flex gap-1 justify-between items-center p-4 bg-[#F0F8FF] shadow-md h-[10vh]  mt-[0px]">
        
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={40}
          className="mt-[-0px]"
        />
        <div className="flex items-center gap-4 mt-[0px]">
          {/* Avatar */}
            <Avatar>
    <AvatarImage src="https://github.com/shadcn.png" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>

          {/* Logout Button */}
          <form action="/auth/logout" method="post">
            <Button variant="blue" className='border-black'>Logout</Button>
          </form>
        </div>
      </div>

      
      <div className="flex-grow flex items-center justify-center mt-[0px]">
        {/* Center the calendar with rounded corners */}
       <div className="bg-white p-4 rounded-xl shadow-lg h-[830px]">

          <TaskCalendar selectedUser={selectedUser}/>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
