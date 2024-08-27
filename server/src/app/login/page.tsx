"use client"; // This tells Next.js that this component is a Client Component

import React from 'react';
import { Button, Input } from 'antd'; 
import Image from 'next/image';

const LoginPage = () => {
    return (
        <div className="h-screen flex">
            {/* Left Column with Image */}
            <div className="w-1/2 bg-blue-100 flex items-center justify-center">
                <Image
                    src="/login.png" 
                    alt="Login"
                    width={370} 
                    height={50} 
                    className="object-cover" 
                />

                     {/* Text Overlay */}
                                    <div className="absolute text-white text-center">
                                        
                                        <p className="text-lg">Enhance record-keeping /n
                    with the seamless 
                    Modern Digital Logbook.</p>
                                </div> 

            </div>

            {/* Right Column with Login Form */}
            <div className="w-1/2 flex items-center justify-center bg-blue-50">
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                    {/* Tiny Image above the Title */}
                    <div className="flex justify-center mb-4">
                        <Image
                            src="/log-file.png" 
                            width={40} // Width for the tiny image
                            height={40} // Height for the tiny image
                        />
                    </div>
                    <h2 className="text-2xl font-semibold mb-6 text-center">T2T Digital Logbook</h2>
                    <form className="flex flex-col" action="/auth/login" method="post">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <Input
                                name="username"
                                placeholder="Enter your username"
                                required
                                className="mt-1 block w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Input.Password
                                name="password"
                                placeholder="Enter your password"
                                required
                                className="mt-1 block w-full"
                            />
                        </div>
                        <div className="flex justify-center">
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="w-full py-2 rounded-md"
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
