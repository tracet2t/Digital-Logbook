import React from 'react';
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Column with Full-Screen Image */}
            <div className="relative w-full md:w-1/2 h-64 md:h-screen">
                <Image
                    src="/login.png"
                    alt="Login"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-none"
                />
                {/* Upper Right Text Overlay */}
                <div className="absolute top-20 md:top-40 right-6 md:right-8 text-white font-bold text-right">
                    <p className="text-lg md:text-3xl lg:text-5xl leading-tight md:leading-snug">
                        Enhance <br /> record-keeping <br />
                        with the seamless <br />
                        Modern <br /> Digital Logbook.
                    </p>
                </div>
            </div>

            {/* Right Column with Login Form */}
            <div className="w-full md:w-1/2 h-auto md:h-screen bg-white flex items-center justify-center p-6 md:p-8">
                <div className="w-full max-w-md">
                    <div className="flex justify-center mb-4">
                        <Image
                            src="/log-file.png"
                            width={40}
                            height={40}
                            alt="Logo"
                        />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">
                        T2T Digital Logbook
                    </h2>
                    <form className="flex flex-col" action="/auth/login" method="post">
                        <div className="mb-4">
                            <Label className="block text-sm font-medium text-gray-700">
                                Email
                            </Label>
                            <Input
                                name="email"
                                placeholder="Enter your email"
                                required
                                className="mt-1 block w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <Label className="block text-sm font-medium text-gray-700">
                                Password
                            </Label>
                            <Input
                                name="password"
                                placeholder="Enter your password"
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
                                Login
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;