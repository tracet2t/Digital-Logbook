"use client";

import React, { useState } from "react";

import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [shake, setShake] = useState(false);
  const [toastData, setToastData] = useState({
    open: false,
    title: "",
    description: "",
    variant: "default" as ToastVariant,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Client-side validation
    const newErrors: { email?: string; password?: string } = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }

    setLoading(true);
    setToastData((prev) => ({
      ...prev,
      open: false,
    }));

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setToastData({
          open: true,
          title: "Access Granted",
          description: "Welcome back. Initializing your workspace...",
          variant: "default",
        });

        if (data.redirectUrl) {
          setTimeout(() => {
            router.push(data.redirectUrl);
          }, 800);
        }
      } else {
        setToastData({
          open: true,
          title: "Authentication Failed",
          description:
            data.error || "Please verify your credentials and try again.",
          variant: "destructive",
        });
        setErrors({
          email: "Invalid credentials",
          password: "Invalid credentials",
        });
        setShake(true);
        setTimeout(() => setShake(false), 600);
        setLoading(false);
      }
    } catch (error) {
      setToastData({
        open: true,
        title: "Network Error",
        description: "Unable to reach the authentication gateway.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <ToastProvider>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        .shake-animation {
          animation: shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }
      `}</style>
      <div className="min-h-screen flex bg-white dark:bg-zinc-950 font-sans antialiased">
        {/* Visual Brand Panel (Desktop) */}
        <div className="hidden lg:flex relative w-7/12 flex-col justify-between p-16 bg-zinc-900 overflow-hidden">
          <Image
            src="/login.png"
            alt="Product Visual"
            fill
            className="object-cover opacity-40 mix-blend-soft-light"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-zinc-950/80" />

          <div className="relative z-10">
            <Image
              src="/logo.png"
              width={180}
              height={45}
              alt="Logo"
              className="h-auto w-full max-w-[180px] shrink-0"
              priority
            />
          </div>

          <div className="relative z-10 max-w-2xl">
            <h1 className="text-6xl xl:text-8xl font-black text-white leading-[1] tracking-tighter mb-8 bg-clip-text">
              Build <br />
              <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">
                Your
              </span>{" "}
              <br />
              Future.
            </h1>
            <p className="text-xl text-zinc-400 font-medium max-w-lg leading-relaxed">
              Learn new skills and track your progress step by step.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-6 text-xs font-bold text-zinc-600 tracking-widest uppercase">
            <span>© 2026 T2T</span>
            <span className="w-8 h-[1px] bg-zinc-800" />
            <span>SECURE ACCESS</span>
          </div>
        </div>

        {/* Auth Interface */}
        <div
          className="flex-1 flex flex-col items-center justify-center p-5 md:p-5 "
          style={{
            backgroundImage:
              "linear-gradient(135deg, #0e131b 0%, #0b0c10 33%, #0c0c11 66%, #0a0b10 100%)",
          }}
        >
          <div
            className={`flex-1 flex flex-col items-center justify-center p-16 md:p-24 w-full rounded-3xl backdrop-blur-md border shadow-2xl transition-all duration-300 ${shake ? "shake-animation" : ""}`}
            style={{
              backgroundColor:
                Object.keys(errors).length > 0
                  ? "rgba(248, 113, 113, 0.1)"
                  : "rgba(255, 255, 255, 0.1)",
              borderColor:
                Object.keys(errors).length > 0
                  ? "rgba(248, 113, 113, 0.3)"
                  : "rgba(255, 255, 255, 0.2)",
            }}
          >
            <div className="w-full max-w-[420px] space-y-12">
              <div className="lg:hidden flex flex-col items-center mb-4">
                <Image
                  src="/logo.png"
                  width={180}
                  height={45}
                  alt="Logo"
                  className="h-auto w-full max-w-[180px]"
                />
              </div>

              <div className="space-y-3 text-center lg:text-left">
                <h2 className="text-5xl font-black text-white tracking-tighter hover:text-blue-300 transition-colors cursor-default">
                  SIGN IN
                </h2>
                <p className="text-white/70 font-medium text-lg leading-relaxed">
                  Connect your account to the central logbook network.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-5">
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="email"
                      className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 transition-colors"
                      style={{
                        color: errors.email
                          ? "#f87171"
                          : "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      Email
                    </Label>
                    <div className="relative group">
                      <Mail
                        className="absolute left-4 top-4 h-4 w-4 transition-colors"
                        style={{
                          color: errors.email
                            ? "#f87171"
                            : "rgba(255, 255, 255, 0.5)",
                        }}
                      />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="user@example.com"
                        required
                        disabled={loading}
                        className="h-14 pl-12 bg-white/10 backdrop-blur-sm border text-white placeholder:text-white/40 focus:ring-4 transition-all text-base font-semibold rounded-xl"
                        style={{
                          borderColor: errors.email
                            ? "rgba(248, 113, 113, 0.5)"
                            : "rgba(255, 255, 255, 0.2)",
                          boxShadow: errors.email
                            ? "0 0 0 4px rgba(248, 113, 113, 0.1)"
                            : undefined,
                        }}
                      />
                    </div>
                    {errors.email && (
                      <p
                        className="text-xs font-bold ml-1 mt-1"
                        style={{ color: "#f87171" }}
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between ml-1">
                      <Label
                        htmlFor="password"
                        className="text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
                        style={{
                          color: errors.password
                            ? "#f87171"
                            : "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        Password
                      </Label>
                      <button
                        type="button"
                        className="text-xs font-black text-blue-300 hover:text-blue-200 tracking-tighter transition-colors"
                      >
                        FORGOT PASSWORD?
                      </button>
                    </div>
                    <div className="relative group">
                      <Lock
                        className="absolute left-4 top-4 h-4 w-4 transition-colors"
                        style={{
                          color: errors.password
                            ? "#f87171"
                            : "rgba(255, 255, 255, 0.5)",
                        }}
                      />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        required
                        disabled={loading}
                        className="h-14 pl-12 pr-12 bg-white/10 backdrop-blur-sm border text-white placeholder:text-white/40 focus:ring-4 transition-all text-base font-semibold rounded-xl"
                        style={{
                          borderColor: errors.password
                            ? "rgba(248, 113, 113, 0.5)"
                            : "rgba(255, 255, 255, 0.2)",
                          boxShadow: errors.password
                            ? "0 0 0 4px rgba(248, 113, 113, 0.1)"
                            : undefined,
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-10 w-10 hover:bg-transparent text-white/50 hover:text-white transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p
                        className="text-xs font-bold ml-1 mt-1"
                        style={{ color: "#f87171" }}
                      >
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 bg-[#000053] dark:bg-white text-zinc-50 dark:text-zinc-950 hover:bg-[#1a1a7a] dark:hover:bg-zinc-200 font-black text-lg shadow-2xl transition-all active:scale-[0.98] rounded-xl tracking-widest"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin font-black" />
                      <span>AUTHORIZING...</span>
                    </div>
                  ) : (
                    "SIGN IN"
                  )}
                </Button>
              </form>

              <div className="pt-8 text-center text-sm font-medium text-white/60">
                New system user?{" "}
                <button className="text-white font-black hover:underline underline-offset-4 tracking-tight">
                  Contact Network Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toast
        open={toastData.open}
        onOpenChange={(open) => setToastData((prev) => ({ ...prev, open }))}
        variant={toastData.variant}
        className="border-none shadow-2xl bg-white text-black dark:bg-black rounded-xl data-[state=open]:slide-in-from-bottom-full data-[state=closed]:slide-out-to-bottom-full"
      >
        <div className="grid gap-1">
          <ToastTitle className="text-base font-black tracking-tight">
            {toastData.title}
          </ToastTitle>
          <ToastDescription className="text-sm opacity-90 font-bold">
            {toastData.description}
          </ToastDescription>
        </div>
        <ToastClose className="text-black !opacity-100 hover:text-zinc-700 focus:text-zinc-900 !hover:text-zinc-700 !focus:text-zinc-900 !group-[.destructive]:text-black !group-[.destructive]:hover:text-zinc-700 !group-[.destructive]:focus:text-zinc-900 !transition-none" />
      </Toast>

      <ToastViewport className="top-auto bottom-0 flex-col" />
    </ToastProvider>
  );
};

export default LoginPage;
