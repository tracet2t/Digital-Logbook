import React from 'react';
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
    return (
        <div className="h-screen flex bg-white">
            {/* Left Column with Image */}
            <div className="relative w-1/2 flex items-center justify-center bg-white">
                <Image
                    src="/login.png" 
                    alt="Login"
                    width={370} 
                    height={50} 
                    className="object-cover rounded-lg border border-black" // Added border
                />

                {/* Text Overlay */}
                <div className="absolute text-center font-bold" style={{ color: '#004AAD', top: '20%', fontSize: '250px' }}>
                    <p className="text-lg">
                        Enhance record-keeping <br />
                        with the seamless <br />
                        Modern Digital Logbook.
                    </p>
                </div>
            </div>

            {/* Right Column with Login Form */}
            <div className="w-1/2 flex items-center justify-center bg-white">
                <Card className="shadow-lg rounded-lg p-8 max-w-md w-full border border-black">
                    {/* Tiny Image above the Title */}
                    <div className="flex justify-center mb-4">
                        <Image
                            src="/log-file.png" 
                            width={40} // Width for the tiny image
                            height={40} // Height for the tiny image
                        />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-center">
                            T2T Digital Logbook
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col" action="/auth/login" method="post">
                            <div className="mb-4">
                                <Label className="block text-sm font-medium text-gray-700">
                                    Username
                                </Label>
                                <Input
                                    name="username"
                                    placeholder="Enter your username"
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;
