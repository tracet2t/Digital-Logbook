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

    const handleUserIconClick = () => {
        alert('User icon clicked!'); // Replace this with the desired action
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
                        src="/logo.png" // Update this path if your logo is stored elsewhere
                        alt="Logo"
                        className="h-32 w-32 object-contain" // Increased size for better visibility
                    />
                </div>

                {/* User Icon */}
                <div>
                    <img
                        src="/user.jpg" // Update this path if your user image is stored elsewhere
                        alt="User Icon"
                        className="h-12 w-12 rounded-full cursor-pointer"
                        onClick={handleUserIconClick}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white shadow-md rounded-md p-6 sm:p-8 max-w-md w-full mt-20">
                {!isRegistering ? (
                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-bold mb-4 text-center">This is mentor's mock page</h1>
                        <button
                            onClick={handleRegisterClick}
                            className="bg-blue-600 text-white py-2 px-4 rounded-md"
                        >
                            Register Student
                        </button>
                    </div>
                ) : (
                    <div className="bg-white p-4 sm:p-6 rounded-md shadow-md w-full mt-8">
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">Register a New Student</h2>
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
                )}
            </div>
        </div>
    );
};

export default MentorDashboard;
