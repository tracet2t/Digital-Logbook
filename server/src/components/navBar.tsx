// components/Navbar.tsx
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StudentDetailsPopup from "./StudentDetailsPopup";

interface NavbarProps {
    userType: "mentor" | "student"; // Determines dashboard type
    userName: string; // User's name
}

const Navbar: React.FC<NavbarProps> = ({ userType, userName }) => {
    const [isStudentPopupOpen, setIsStudentPopupOpen] = useState(false);
    const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
    const logoutPopupRef = useRef<HTMLDivElement | null>(null);

    const openStudentPopup = () => setIsStudentPopupOpen(true);
    const closeStudentPopup = () => setIsStudentPopupOpen(false);
    const toggleLogoutPopup = () => setIsLogoutPopupOpen((prev) => !prev);

    const handleLogout = () => {
        // Clear authentication data
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Redirect to login page
        window.location.href = "/login";
    };

    // Close logout popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                logoutPopupRef.current &&
                event.target instanceof Node &&
                !logoutPopupRef.current.contains(event.target)
            ) {
                setIsLogoutPopupOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex justify-between items-center bg-white shadow-md p-2 rounded-md h-16">
            {/* Logo & Navigation */}
            <div className="flex items-center gap-4">
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={150} // Fixed size for better visibility
                    height={150}
                    className="w-150 h-150"
                />
                {/* Show navigation only for mentors */}
                {userType === "mentor" && (
                    <nav className="flex gap-5">
                        <button className="text-blue-500 font-semibold text-lg transition-transform transform hover:scale-105 hover:text-red-500 hover:bg-yellow-100 hover:shadow-lg hover:-translate-y-1">
                            Home
                        </button>
                        <button
                            className="text-gray-600 hover:text-green-800 text-lg transition-transform transform hover:scale-105 hover:bg-yellow-100 hover:shadow-lg hover:-translate-y-1"
                            onClick={openStudentPopup}
                        >
                            Student
                        </button>
                        
                    </nav>
                )}
            </div>

            {/* User Profile & Notifications */}
            <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 cursor-pointer" />
                <div className="flex items-center gap-2">
                    <div className="text-right">
                        <span className="font-medium text-sm">{userName}</span>
                        <p className="text-xs text-gray-500">
                            {userType === "mentor" ? "Senior Mentor" : "Student"}
                        </p>
                    </div>
                    <Avatar className="cursor-pointer" onClick={toggleLogoutPopup}>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {/* Logout Popup */}
                    {isLogoutPopupOpen && (
                    <div ref={logoutPopupRef} className="absolute top-20 right-6 bg-white shadow-lg rounded-md p-4 w-56 border">
                    <button
                         onClick={() => setIsLogoutPopupOpen(false)}  // Close popup when clicked
                         className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 font-bold text-lg"
                        >
                        &times; {/* This is the "X" close icon */}
                    </button>
                    <div className="flex justify-center mb-3">
                         <Avatar className="h-16 w-16">
                             <AvatarImage src="https://github.com/shadcn.png" />
                        </Avatar>
                    </div>
                     <p className="text-sm text-gray-600 mb-4 text-center">Are you sure you want to logout?</p>
                    <button
                        onClick={handleLogout}
                            className="w-full text-center bg-red-100 text-sm text-red-500 hover:bg-red-500 hover:text-white px-3 py-2 rounded-md"
                    >
                        Logout
                    </button>
                    </div>


                    
                    )}
                </div>
            </div>
            {/* Conditionally render the StudentDetailsPopup */}
            {isStudentPopupOpen && <StudentDetailsPopup isOpen={isStudentPopupOpen} onClose={closeStudentPopup} />}
        </div>
    );
};

export default Navbar;
