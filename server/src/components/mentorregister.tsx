"use client"; // This tells Next.js that this component is a Client Component

import React, { useState } from 'react';

const MentorDashboard = () => {
    const [isRegistering, setIsRegistering] = useState(false);

    const handleRegisterClick = () => {
        setIsRegistering(true);
    };

    const handleCancelClick = () => {
        setIsRegistering(false);
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-500">
            <div className="relative bg-white shadow-md rounded-md p-8 max-w-md w-full">
                {!isRegistering ? (
                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-bold mb-4">This is mentor's mock page</h1>
                        <button
                            onClick={handleRegisterClick}
                            className="bg-blue-600 text-white py-2 px-4 rounded-md"
                        >
                            Register Student
                        </button>
                    </div>
                ) : (
                    <div>
                        <button
                            onClick={handleCancelClick}
                            className="absolute top-2 left-2 text-gray-500 hover:text-gray-800"
                        >
                            &larr; {/* Arrow symbol */}
                        </button>
                        <div className="bg-white p-6 rounded-md shadow-md w-full mt-8">
                            <h2 className="text-2xl font-semibold mb-4">Register a New Student</h2>
                            <form>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="enter student’s first name"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="enter student’s last name"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="enter student’s email"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div className="flex justify-center mt-6">
                                    <button
                                        type="submit"
                                        className="bg-[#0000FF] text-white py-2 px-8 rounded-md"
                                    >
                                        Register
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MentorDashboard;
