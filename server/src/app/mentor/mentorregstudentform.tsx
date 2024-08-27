
"use client"; // Ensure the page is a client component

import React, { useState } from 'react';
import MentorRegStudentForm from '@/components/mentorregstudentform'; 

const MentorPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Mentor Dashboard</h1>
      <button onClick={openModal} className="bg-blue-500 text-white py-2 px-4 rounded">
        Register Student
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 absolute top-2 right-2">
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">Register a New Student</h2>
            <MentorRegStudentForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorPage;
