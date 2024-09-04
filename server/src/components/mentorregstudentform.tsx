// components/MentorRegStudentForm.tsx
'use client'; // This component is a client component

import { useState } from 'react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerStudent } from '@/services/registerstudent';

export default function MentorRegStudentForm() {
  const [isVisible, setIsVisible] = useState(true); // Manage visibility state internally

  const handleSubmit = async (formData: FormData) => {
    try {
      await registerStudent(formData); // Call the server action to register the student
      alert('Student registered successfully!'); // Show success message
      setIsVisible(false); // Hide the form on successful registration
    } catch (error) {
      alert('Error registering student. Please try again.'); // Show error message
    }
  };

  const handleClose = () => {
    setIsVisible(false); // Hide the form on cancel
  };

  if (!isVisible) return null; // Don't render the form if it's not visible

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="relative w-full max-w-lg mx-auto bg-white rounded-xl shadow-xl p-6">
        {/* Top Bar with Arrow Key */}
        <div className="absolute top-0 left-4 right-4 flex items-center justify-start p-4">
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800 transition-colors duration-200"
          >
            &larr; {/* Arrow symbol */}
          </button>
        </div>

        {/* Registration Form within a Card */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">Register a New Student</CardTitle>
            <CardDescription className="text-gray-600">
              Fill in the details below to register a new student.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSubmit(formData);
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <Label htmlFor="firstName" className="text-gray-700">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Enter student’s first name"
                  required
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName" className="text-gray-700">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Enter student’s last name"
                  required
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter student’s email"
                  required
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                />
              </div>
              <CardFooter className="flex justify-center pt-6">
                <Button
                  type="submit"
                  variant="blue"
                  size="lg"
                  className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                >
                  Register
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
