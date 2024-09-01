import React from 'react';

const WelcomeEmail: React.FC = () => {
    const studentName = "[Student's Name]"; // Replace with actual student's name
    const temporaryPassword = "[Temporary Password]"; // Replace with actual temporary password
    const applicationLink = "[Application Link]"; // Replace with actual application link

    return (
        <div className="relative bg-gray-100 min-h-screen flex items-center justify-center p-4">
            {/* Logo in the top-left corner */}
            <img
                src="/logo.png" // Update this path if your logo is stored elsewhere
                alt="Logo"
                className="absolute top-4 left-4 h-24 w-auto object-contain"
            />
            <div className="w-full max-w-lg p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to Our Digital Logbook!</h1>
                <p className="text-gray-700 mb-4">Dear {studentName},</p>
                <p className="text-gray-700 mb-4">Thank you for joining us! We're excited to have you on board and look forward to working together.</p>
                <p className="text-gray-700 mb-2">Your temporary password is:</p>
                <p className="bg-gray-200 text-red-600 font-mono text-lg p-2 rounded mb-4">
                    {temporaryPassword}
                </p>
                <p className="text-gray-700 mb-4">Use this password to log in to your account. We recommend changing it once you have successfully logged in.</p>
                <p className="text-gray-700 mb-4">To access the application, please use the following link:</p>
                <a
                    href={applicationLink}
                    className="text-blue-500 hover:underline"
                >
                    Go to Application
                </a>
                <p className="text-gray-500 mt-4 text-sm">
                    If you have any questions, feel free to contact our support team.
                </p>
            </div>
        </div>
    );
};

export default WelcomeEmail;
