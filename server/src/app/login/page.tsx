'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation'; 
import {
    ToastProvider,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose
} from "@/components/ui/toast";

type ToastVariant = 'default' | 'destructive';

const LoginPage = () => {
    const router = useRouter();
    const [toastData, setToastData] = useState({
        open: false,
        title: '',
        description: '',
        variant: 'default' as ToastVariant, // Ensure correct type
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        setToastData((prev) => ({
            ...prev,
            open: false,
        }));

        try {
            const res = await fetch('/auth/login', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setToastData({
                    open: true,
                    title: 'Login Successful',
                    description: 'Welcome back!',
                    variant: 'default',
                });

                if (data.redirectUrl) {
                    setTimeout(() => {
                        router.push(data.redirectUrl);
                    }, 1000);
                }
            } else {
                setToastData({
                    open: true,
                    title: 'Login Failed',
                    description: data.error || 'Invalid email or password.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            setToastData({
                open: true,
                title: 'Error',
                description: 'Something went wrong, please try again later.',
                variant: 'destructive',
            });
        }
    };

    return (
        <ToastProvider>
            <div className="min-h-screen flex flex-col md:flex-row">
                <div className="relative w-full md:w-1/2 h-64 md:h-screen">
                    <Image
                        src="/login.png"
                        alt="Login"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-none"
                    />
                    <div className="absolute top-20 md:top-40 right-6 md:right-8 text-white font-bold text-right">
                        <p className="text-lg md:text-3xl lg:text-5xl leading-tight md:leading-snug">
                            Enhance <br /> record-keeping <br />
                            with the seamless <br />
                            Modern <br /> Digital Logbook.
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-1/2 h-auto md:h-screen bg-white flex items-center justify-center p-6 md:p-8">
                    <div className="w-full max-w-md">
                        <div className="flex justify-center mb-4">
                            {/* <Image
                                src="/log-file.png"
                                width={40}
                                height={40}
                                alt="Logo"
                            /> */}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">
                            T2T Digital Logbook
                        </h2>
                        <form className="flex flex-col" onSubmit={handleSubmit}>
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

            {toastData.open && (
                <Toast variant={toastData.variant}>
                    <ToastTitle>{toastData.title}</ToastTitle>
                    <ToastDescription>{toastData.description}</ToastDescription>
                    <ToastClose />
                </Toast>
            )}

            <ToastViewport />
        </ToastProvider>
    );
};

export default LoginPage;
