"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RegistrationForm: React.FC = () => {
  const handleCancelClick = () => {
    console.log("Cancel clicked");
  };

  const handleUserIconClick = () => {
    alert("User icon clicked!");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-500 relative">
      {/* Top Bar with Logo, Arrow Key, and User Icon */}
      <div className="absolute top-0 left-4 right-4 flex items-center justify-between">
        {/* Arrow Key and Logo */}
        <div className="flex items-center">
          <button
            onClick={handleCancelClick}
            className="text-gray-500 hover:text-gray-800 mr-4"
          >
            &larr; {/* Arrow symbol */}
          </button>
          <img
            src="/logo.png"
            alt="Logo"
            className="h-32 w-32 object-contain"
          />
        </div>

        {/* User Icon */}
        <div>
          <img
            src="/user.jpg"
            alt="User Icon"
            className="h-12 w-12 rounded-full cursor-pointer"
            onClick={handleUserIconClick}
          />
        </div>
      </div>

      {/* Registration Form within a Card */}
      <Card className="w-full max-w-md mx-auto mt-20">
        <CardHeader>
          <CardTitle className="text-center">Register a New Student</CardTitle>
          <CardDescription className="text-center">
            Fill in the details below to register a new student.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter student’s first name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter student’s last name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter student’s email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button type="submit" variant="blue" size="lg">
            Register
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegistrationForm;
