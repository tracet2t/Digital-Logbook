'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerStudent } from '@/services/registerstudent';
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from "@/components/ui/toast"; // Adjust import path if necessary

export default function MentorRegStudentForm({ onClose }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [toast, setToast] = useState<{ title: string; description: string } | null>(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerStudent(formData);
      setToast({
        title: 'Success',
        description: 'Student registered successfully!',
      });
      setTimeout(() => setToast(null), 3000); // Hide toast after 3 seconds
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
      })
      // onClose();
    } catch (error) {
      setToast({
        title: 'Error',
        description: 'Error registering student. Please try again.',
      });
      setTimeout(() => setToast(null), 3000); // Hide toast after 3 seconds
    }
  };

  return (
    <ToastProvider>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <Card className="w-full max-w-lg p-4 z-60">
          <CardHeader>
            <h2>Register Student</h2>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="mb-4">
                <label>
                  First Name
                  <Input 
                    type="text" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    placeholder="First Name" 
                    required 
                  />
                </label>
              </div>
              <div className="mb-4">
                <label>
                  Last Name
                  <Input 
                    type="text" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    placeholder="Last Name" 
                    required 
                  />
                </label>
              </div>
              <div className="mb-4">
                <label>
                  Email
                  <Input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="Email" 
                    required 
                  />
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="submit" className="bg-green-500 hover:bg-green-600">Register</Button>
              <Button type="button" className="bg-red-500 hover:bg-red-600" onClick={onClose}>
                Cancel
              </Button>
            </CardFooter>
          </form>
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
}
