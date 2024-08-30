import React from 'react';
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ResetPasswordPage = () => {
    return (
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
                {/* Upper Right Text Overlay */}
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
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
