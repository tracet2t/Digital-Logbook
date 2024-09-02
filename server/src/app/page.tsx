`use client`

import TaskCalendar from "@/components/calendar";
import Image from "next/image";
import { Button } from "@/components/ui/button"
import  { Avatar, AvatarFallback, AvatarImage }  from "@/components/ui/avatar"

export default function Home() {
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
            <Button >Logout</Button>
          </form>
        </div>
      </div>

      
      <div className="flex-grow flex items-center justify-center mt-[-100px]">
        {/* Center the calendar with rounded corners */}
        <div className="bg-white p-4 rounded-xl shadow-lg h-128">
          <TaskCalendar />
        </div>
      </div>
    </div>
  );
}
