"use client";

import React, { useState } from "react";

import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { useCompleteRegistration } from "@/hooks/admin/useCompleteRegistration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

type ToastVariant = "default" | "destructive";

export default function CreateAccount() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toastData, setToastData] = useState({
    open: false,
    title: "",
    description: "",
    variant: "default" as ToastVariant,
  });

  const { mutate: completeRegistration, isPending } = useCompleteRegistration();

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!tempPassword || !newPassword || !confirmPassword) {
      setToastData({
        open: true,
        title: "Missing Fields",
        description: "All fields are required to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setToastData({
        open: true,
        title: "Password Mismatch",
        description: "Your new password and confirmation must match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      setToastData({
        open: true,
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    completeRegistration(
      { email, token, tempPassword, newPassword },
      {
        onSuccess: () => {
          setToastData({
            open: true,
            title: "Account Created",
            description:
              "Your account has been successfully created. Redirecting...",
            variant: "default",
          });
          setTimeout(() => {
            router.push("/login");
          }, 1000);
        },
        onError: (error: any) => {
          setToastData({
            open: true,
            title: "Registration Failed",
            description:
              error?.message || "An error occurred during registration.",
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex bg-white dark:bg-zinc-950 font-sans antialiased">
        {/* Visual Brand Panel (Desktop) */}
        <div className="hidden lg:flex relative w-7/12 flex-col justify-between p-16 bg-zinc-900 border-r border-zinc-800 overflow-hidden">
          <Image
            src="/login.png"
            alt="Product Visual"
            fill
            className="object-cover opacity-40 mix-blend-soft-light"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-zinc-950/80" />

          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-blue-600 rounded-xl shadow-2xl shadow-blue-500/40">
                <Image
                  src="/log-file.png"
                  width={32}
                  height={32}
                  alt="Logo"
                  className="invert brightness-0"
                />
              </div>
              <span className="text-2xl font-black tracking-tight text-white uppercase italic">
                Digital LogBook
              </span>
            </div>
          </div>

          <div className="relative z-10 max-w-2xl">
            <h1 className="text-6xl xl:text-8xl font-black text-white leading-[1] tracking-tighter mb-8 bg-clip-text">
              Welcome to <br />
              <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">
                the Network
              </span>{" "}
              <br />
              Initialize Now.
            </h1>
            <p className="text-xl text-zinc-400 font-medium max-w-lg leading-relaxed">
              Set up your secure credentials and join a community of precision
              record keepers.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-6 text-xs font-bold text-zinc-600 tracking-widest uppercase">
            <span>© 2026 T2T </span>
            <span className="w-8 h-[1px] bg-zinc-800" />
            <span>SECURE SETUP</span>
          </div>
        </div>

        {/* Auth Interface */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16">
          <div className="w-full max-w-[420px] space-y-12">
            <div className="lg:hidden flex flex-col items-center space-y-4 mb-4">
              <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl">
                <Image src="/log-file.png" width={48} height={48} alt="Logo" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter italic">
                LOGBOOK PRO
              </h1>
            </div>

            <div className="space-y-3 text-center lg:text-left">
              <h2 className="text-5xl font-black text-zinc-900 dark:text-white tracking-tighter hover:text-blue-600 transition-colors cursor-default">
                CREATE ACCOUNT
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg leading-relaxed">
                Set up your credentials to access the logbook network.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-8">
              <div className="space-y-5">
                {/* Email Field (Disabled) */}
                <div className="space-y-2.5">
                  <Label
                    htmlFor="email"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1"
                  >
                    Organizational Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-4 h-4 w-4 text-blue-500" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="h-14 pl-12 bg-zinc-100 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-base font-semibold rounded-xl cursor-not-allowed opacity-60"
                    />
                  </div>
                </div>

                {/* Temporary Password */}
                <div className="space-y-2.5">
                  <Label
                    htmlFor="tempPassword"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1"
                  >
                    Temporary Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-4 h-4 w-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="tempPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={tempPassword}
                      onChange={(e) => setTempPassword(e.target.value)}
                      disabled={isPending}
                      required
                      className="h-14 pl-12 pr-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-4 focus:ring-blue-500/10 transition-all text-base font-semibold rounded-xl"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-10 w-10 hover:bg-transparent text-zinc-400 hover:text-zinc-900 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isPending}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2.5">
                  <Label
                    htmlFor="newPassword"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1"
                  >
                    New Security Key
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-4 h-4 w-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isPending}
                      required
                      className="h-14 pl-12 pr-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-4 focus:ring-blue-500/10 transition-all text-base font-semibold rounded-xl"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-10 w-10 hover:bg-transparent text-zinc-400 hover:text-zinc-900 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isPending}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2.5">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1"
                  >
                    Confirm Security Key
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-4 h-4 w-4 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isPending}
                      required
                      className="h-14 pl-12 pr-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:ring-4 focus:ring-blue-500/10 transition-all text-base font-semibold rounded-xl"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-10 w-10 hover:bg-transparent text-zinc-400 hover:text-zinc-900 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isPending}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-zinc-900 dark:bg-white text-zinc-50 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-black text-lg shadow-2xl transition-all active:scale-[0.98] rounded-xl tracking-widest"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin font-black" />
                    <span>INITIALIZING...</span>
                  </div>
                ) : (
                  "COMPLETE REGISTRATION"
                )}
              </Button>
            </form>

            <div className="pt-8 text-center text-sm font-medium text-zinc-500">
              Already have credentials?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-zinc-900 dark:text-white font-black hover:underline underline-offset-4 tracking-tight"
              >
                Sign In Instead
              </button>
            </div>
          </div>
        </div>
      </div>

      {toastData.open && (
        <Toast
          variant={toastData.variant}
          className="border-none shadow-2xl bg-white dark:bg-zinc-900 rounded-xl"
        >
          <div className="grid gap-1">
            <ToastTitle className="text-base font-black tracking-tight">
              {toastData.title}
            </ToastTitle>
            <ToastDescription className="text-sm opacity-90 font-bold">
              {toastData.description}
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>
      )}

      <ToastViewport />
    </ToastProvider>
  );
}
