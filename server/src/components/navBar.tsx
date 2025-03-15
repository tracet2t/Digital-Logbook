// components/Navbar.tsx
import React from 'react';
import Image from 'next/image';
import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center bg-white shadow-md p-2 rounded-md h-16">
      {/* Logo & Navigation */}
      <div className="flex items-center gap-4">
        <Image
          src="/logo.png"
          alt="Logo"
          width={10}
          height={10}
          className="max-h-[200px] w-auto"
        />
        <nav className="flex gap-5">
          <button className="text-blue-500 font-semibold text-lg transition-transform transform hover:scale-105 hover:text-red-500 hover:bg-yellow-100 hover:shadow-lg hover:-translate-y-1">
             Home
          </button>
          <button className="text-gray-600 hover:text-green-800 text-lg transition-transform transform hover:scale-105 hover:bg-yellow-100  hover:shadow-lg hover:-translate-y-1">
             Dashboard Overview
          </button>
          <button className="text-gray-600 hover:text-green-800 text-lg transition-transform transform hover:scale-105 hover:bg-yellow-100  hover:shadow-lg hover:-translate-y-1">
             Settings
          </button>
        </nav>

      </div>

      {/* User Profile & Notifications */}
      <div className="flex items-center gap-3">
        <Bell className="w-5 h-5 cursor-pointer" />
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="font-medium text-sm">Jhon</span>
            <p className="text-xs text-gray-500">Senior Mentor</p>
          </div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JH</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
