"use client"; // Ensures the component runs on the client side

import React, { useState } from 'react';

const MentorRegStudentForm: React.FC = () => {
  // State variables for form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      firstName,
      lastName,
      email,
    };

    try {
      const response = await fetch('/api/register-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Student registered successfully');
        // Clear form fields
        setFirstName('');
        setLastName('');
        setEmail('');
      } else {
        console.error('Failed to register student');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  // Handle form cancellation
  const handleCancel = () => {
    // Clear form fields
    setFirstName('');
    setLastName('');
    setEmail('');
    
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Register Student
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="mt-4 bg-gray-500 text-white py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default MentorRegStudentForm;
