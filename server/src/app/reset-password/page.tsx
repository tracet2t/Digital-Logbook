import React from 'react';
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from '@heroicons/react/24/outline'; // Import the back icon

const ResetPasswordPage = () => {
    return (
        <div className="h-screen flex flex-col md:flex-row bg-white">
            {/* Left Column with Image */}
            <div className="relative w-full md:w-1/2 flex items-center justify-center bg-white p-4 md:p-8">
                {/* Back Icon */}
                <div className="absolute top-4 left-4">
                    <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none">
                        <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
                    </button>
                </div>
                
                <Image
                    src="/login.png" 
                    alt="Login"
                    width={370} 
                    height={50} 
                    className="object-cover rounded-lg border border-black"
                />
                
                {/* Text Overlay */}
                <div className="absolute text-center font-bold" style={{ color: '#004AAD', top: '20%', fontSize: '8vw' }}>
                    <p className="text-lg">
                        Enhance record-keeping <br />
                        with the seamless <br />
                        Modern Digital Logbook.
                    </p>
                </div>
            </div>

            {/* Right Column with Reset Password Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-4 md:p-8">
                <Card className="shadow-lg rounded-lg p-6 md:p-8 max-w-md w-full border border-black">
                    
                    <div className="flex justify-center mb-4">
                        <Image
                            src="/log-file.png" 
                            width={40} 
                            height={40} 
                        />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-center">
                            Reset Password
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col" action="/auth/reset-password" method="post">
                            <div className="mb-4">
                                <Label className="block text-sm font-medium text-gray-700">
                                    Current Password
                                </Label>
                                <Input
                                    name="currentPassword"
                                    placeholder="Enter your current password"
                                    type="password"
                                    required
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <Label className="block text-sm font-medium text-gray-700">
                                    New Password
                                </Label>
                                <Input
                                    name="newPassword"
                                    placeholder="Enter your new password"
                                    type="password"
                                    required
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <Label className="block text-sm font-medium text-gray-700">
                                    Confirm New Password
                                </Label>
                                <Input
                                    name="confirmNewPassword"
                                    placeholder="Confirm your new password"
                                    type="password"
                                    required
                                    className="mt-1 block w-full"
                                />
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
