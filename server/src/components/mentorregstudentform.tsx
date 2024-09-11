'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerStudent } from '@/services/registerstudent';

export default function MentorRegStudentForm({ onClose }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerStudent(formData); // Pass the plain object instead of FormData
      alert('Student registered successfully!');
      onClose(); // Close the form on successful registration
    } catch (error) {
      alert('Error registering student. Please try again.');
    }
  };

  return (
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
    </div>
  );
}
