"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function ProfileCard() {
  const [isCardVisible, setIsCardVisible] = useState(false);
  const router = useRouter();

  // Toggle the visibility of the card
  const toggleCardVisibility = () => {
    setIsCardVisible(!isCardVisible);
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      // Send a POST request to the logout route
      const response = await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include', // Ensures cookies are sent with the request
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Redirect to the login page or home page after logout
        router.push('/login'); // Adjust to your login route
      } else {
        console.error('Logout failed: ', await response.text());
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };

  return (
    <div className="relative">
      {/* Button to toggle the visibility of the profile card */}
      <button onClick={toggleCardVisibility} className="absolute top-4 right-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </button>

      {/* Conditional rendering of the profile card */}
      {isCardVisible && (
        <div className="absolute top-16 right-0 bg-gradient-to-b from-blue-100 to-blue-200 p-3 border border-gray-200 rounded shadow-lg">
          <Card className="w-56 rounded-lg overflow-hidden shadow-xl">
            {/* Card header with avatar and green background */}
            <CardHeader className="relative flex flex-col items-center justify-center bg-green-400 h-28 p-3">
              <Avatar className="w-20 h-20 border-4 border-white absolute -bottom-10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </CardHeader>

            {/* Card content displaying the user's name and email */}
            <CardContent className="mt-12 text-center p-2">
              <CardTitle className="text-md font-semibold">Mohamed Asfik</CardTitle>
              <p className="text-xs text-gray-700">asfikforever@gmail.com</p>
            </CardContent>

            {/* Card footer with the logout button */}
            <CardFooter className="flex justify-center p-2">
              <button
                className="bg-gray-500 text-white py-1 px-3 rounded-md hover:bg-gray-600"
                onClick={handleLogout}
              >
                Logout
              </button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
