// src/components/ProfileCard.tsx
"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function ProfileCard() {
  const [isCardVisible, setIsCardVisible] = useState(false);
  const router = useRouter();

  const toggleCardVisibility = () => {
    setIsCardVisible(!isCardVisible);
  };

  const handleLogout = async () => {
    // Clear authentication tokens (adjust according to your storage method)
    localStorage.removeItem('authToken');
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT;';

    // Redirect to the login page or home page after logout
    router.push('/login'); // Adjust to your login route
  };

  return (
    <div className="absolute top-4 right-4">
      <button onClick={toggleCardVisibility}>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </button>
      {isCardVisible && (
        <div className="absolute top-16 right-0 bg-light-green-100 p-4 border border-gray-200 rounded shadow-lg">
          <Card>
            <CardHeader className="flex flex-col items-center bg-light-green-100 p-2">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-2 text-lg font-semibold">Mohamed Asfik</CardTitle>
            </CardHeader>
            <CardContent className="bg-light-green-100 p-4">
              <p className="text-center text-sm text-gray-700">asfikforever@gmail.com</p>
            </CardContent>
            <CardFooter className="flex justify-center bg-light-green-100 p-2">
              <button
                className="bg-red-500 text-white py-1 px-4 rounded"
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
