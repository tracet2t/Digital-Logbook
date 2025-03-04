'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import {
    ToastProvider,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
    ToastViewport
} from "@/components/ui/toast";  // Import toast components

type ToastVariant = 'default' | 'destructive';


const ResetPasswordPage = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState("Weak");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const [toastData, setToastData] = useState({
        open: false,
        title: '',
        description: '',
        variant: 'default' as ToastVariant
    });
    const router = useRouter();

    // function to evaluate the password strength based on security rules
    const evaluatePasswordStrength = (password: string) => {    
        if (password.length < 6) return "Weak"; 
        if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) return "Strong";
        return "Moderate"; 
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        // Reset the toast state before a new login attempt
        setToastData((prev) => ({
            ...prev,
            open: false,
        }));

        if (newPassword !== confirmNewPassword) {
            setToastData({
                open: true,
                title: 'Error',
                description: "Passwords do not match",
                variant: 'destructive'
            });
            return;
        }

        if (!evaluatePasswordStrength(newPassword)) { 

            setToastData({
                open: true,
                title: 'Error',
                description: "Password must include at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long",
                variant: 'destructive'
            });
            return;
        }

        try {
            const response = await fetch('/auth/reset-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setToastData({
                    open: true,
                    title: 'Error',
                    description: data.error || "An error occurred",
                    variant: 'destructive'
                });
            } else {
                setToastData({
                    open: true,
                    title: 'Success',
                    description: "Password updated successfully",
                    variant: 'default'
                });
                router.push('/student'); // Redirect to the student page
            }
        } catch (error) {
            setToastData({
                open: true,
                title: 'Error',
                description: "Failed to reset password",
                variant: 'destructive'
            });
        }
    };

    useEffect(() => {
        setPasswordStrength(evaluatePasswordStrength(newPassword));
        if (toastData.open) {
            // Automatically close toast after a short delay
            const timer = setTimeout(() => {
                setToastData(prev => ({ ...prev, open: false }));
            }, 10000); // Adjust the duration as needed

            return () => clearTimeout(timer);
        }
    }, [toastData, newPassword]); // fix error here 


    return (
        <ToastProvider>
            <div className="h-screen flex flex-col md:flex-row">
                {/* Left Column with Full-Screen Image */}
                <div className="relative w-full md:w-1/2 h-1/2 md:h-full">
                    <Image
                        src="/login.png"
                        alt="Reset Password"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-none"
                    />
                    <div className="absolute top-40 right-8 text-white font-bold text-right">
                        <p className="text-xl md:text-3xl lg:text-5xl leading-tight md:leading-snug">
                            Enhance <br /> record-keeping <br />
                            with the seamless <br />
                            Modern <br /> Digital Logbook.
                        </p>
                    </div>
                </div>

                {/* Right Column with Reset Password Form */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full bg-white flex items-center justify-center p-6 md:p-8">
                    <div className="w-full max-w-md">
                        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">
                            Reset Password
                        </h2>
                        <form className="flex flex-col" onSubmit={handleSubmit}>
                            <div className="relative mb-4">
                                <Label className="block text-sm font-medium text-gray-700">
                                    Current Password
                                </Label>
                                <Input
                                    name="currentPassword"
                                    placeholder="Enter your current password"
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                    className="mt-1 block w-full"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-9 text-gray-500"
                                >
                                    {showCurrentPassword ? "🔓" : "👁️"}
                                </button>
                            </div>
                            <div className="relative mb-4">
                                <Label className="block text-sm font-medium text-gray-700">
                                    New Password
                                </Label>
                                <Input
                                    name="newPassword"
                                    placeholder="Enter your new password"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className={`mt-1 block w-full ${
                                        passwordStrength === "Weak" ? "border-red-500" : 
                                        passwordStrength === "Moderate" ? "border-yellow-500" : 
                                        "border-green-500"
                                    }`}
                                    required
                                /> 
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-9 text-gray-500"
                                >
                                    {showNewPassword ? "🔓" : "👁️"}
                                </button>
                                <p className="text-sm mt-1">
                                   Strength: <span className={
                                        passwordStrength === "Weak" ? "text-red-500" :
                                        passwordStrength === "Moderate" ? "text-yellow-500" :
                                        "text-green-500"
                                    }>
                                        {passwordStrength}
                                    </span>
                                </p>
                                
                            </div>
                            <div className="relative mb-4">
                                <Label className="block text-sm font-medium text-gray-700">
                                    Confirm New Password
                                </Label>
                                <Input
                                    name="confirmNewPassword"
                                    placeholder="Confirm your new password"
                                    type={showConfirmNewPassword ? "text" : "password"}
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    required
                                    className="mt-1 block w-full"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                    className="absolute right-3 top-9 text-gray-500"
                                >
                                    {showConfirmNewPassword ? "🔓" : "👁️"}
                                </button>
                            </div>
                            <div className="flex justify-center">
                                <Button
                                    type="submit"
                                    className="w-full py-2 rounded-md bg-[#0000FF] text-white hover:bg-[#0000CC]"
                                >
                                    Reset Password
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {toastData.open && (
                <Toast variant={toastData.variant}>
                    <ToastTitle>{toastData.title}</ToastTitle>
                    <ToastDescription>{toastData.description}</ToastDescription>
                    <ToastClose />
                </Toast>
            )}

            {/* Toast Viewport for stacking multiple toasts */}
            <ToastViewport />
        </ToastProvider>
    );
};

export default ResetPasswordPage;
