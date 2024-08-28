"use client"; // This tells Next.js that this component is a Client Component

import React from 'react';

const RegistrationForm: React.FC = () => {
    const handleCancelClick = () => {
        // Define what should happen when the arrow key is clicked
        console.log('Cancel clicked');
    };

    const handleUserIconClick = () => {
        // Define what should happen when the user icon is clicked
        alert('User icon clicked!');
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
                        className="h-32 w-32 object-contain" // Adjust size as needed
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

            {/* Registration Form */}
            <div className="bg-white p-4 sm:p-6 rounded-md shadow-md w-full max-w-md mx-auto mt-20">
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
        </div>
    );
};

export default RegistrationForm;
