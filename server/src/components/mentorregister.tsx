"use client";

import * as React from "react";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast"; // Adjust the import path according to your project structure

const RegistrationForm: React.FC = () => {
  const [toast, setToast] = useState<{ title: string; description: string } | null>(null);

  const handleCancelClick = () => {
    console.log("Cancel clicked");
  };

  const handleUserIconClick = () => {
    alert("User icon clicked!");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Simulate form submission
    setToast({
      title: "Registration Successful",
      description: "The student has been registered successfully.",
    });

    // Clear toast after a short delay
    setTimeout(() => {
      setToast(null);
    }, 1000); // Adjust delay as needed
  };

  return (
    <ToastProvider>
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
            <Avatar className="cursor-pointer" onClick={handleUserIconClick}>
              <AvatarImage src="/user.jpg" alt="User Icon" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
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
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter student’s first name"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter student’s last name"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter student’s email"
                />
              </div>
              <CardFooter className="flex justify-center">
                <Button type="submit" variant="blue" size="lg">
                  Register
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>

        {toast && (
          <Toast>
            <ToastTitle>{toast.title}</ToastTitle>
            <ToastDescription>{toast.description}</ToastDescription>
            <ToastClose />
          </Toast>
        )}
        <ToastViewport />
      </div>
    </ToastProvider>
  );
};

export default RegistrationForm;
