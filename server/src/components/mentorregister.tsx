"use client";

import * as React from "react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

// Adjust the import path according to your project structure

const RegistrationForm: React.FC = () => {
  const [toast, setToast] = useState<{
    title: string;
    description: string;
  } | null>(null);

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
      description: "The mentee has been registered successfully.",
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
            <CardTitle className="text-center">Register a New Mentee</CardTitle>
            <CardDescription className="text-center">
              Fill in the details below to register a new mentee.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter mentee’s first name"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter mentee’s last name"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter mentee’s email"
                />
              </div>
              <CardFooter className="flex justify-center">
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
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
