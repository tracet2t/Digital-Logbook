"use client";

import React, { useState } from "react";

import { useCompleteRegistration } from "@/_hooks/admin/useCompleteRegistration";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

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
  const [errors, setErrors] = useState<{
    tempPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [shake, setShake] = useState(false);
  const [toastData, setToastData] = useState({
    open: false,
    title: "",
    description: "",
    variant: "default" as ToastVariant,
  });

  const { mutate: completeRegistration, isPending } = useCompleteRegistration();

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!tempPassword) {
      newErrors.tempPassword = "Temporary password is required";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setToastData({
        open: true,
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    setErrors({});

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
          setShake(true);
          setTimeout(() => setShake(false), 600);
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
        <section
          className="flex-1 flex flex-col items-center justify-center p-5 md:p-5"
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
            <div className="w-full max-w-[520px] space-y-8">
              <div className="lg:hidden flex flex-col items-center mb-4">
                <Image
                  src="/logo.png"
                  width={180}
                  height={45}
                  alt="Logo"
                  className="h-auto w-full max-w-[180px]"
                />
              </div>

              <div className="space-y-2 text-left">
                <h2 className="text-4xl font-black tracking-tight text-white">
                  Create Account
                </h2>
                <p className="text-[15px] text-white/70">
                  Set up your credentials to access the logbook network.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-5">
                  {/* Email Field (Disabled) */}
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="email"
                      className="text-[11px] font-bold uppercase tracking-[0.18em]"
                      style={{ color: "rgba(255, 255, 255, 0.7)" }}
                    >
                      Organizational Email
                    </Label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                        style={{ color: "rgba(255, 255, 255, 0.5)" }}
                      />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        disabled
                        className="h-12 pl-10 bg-white/5 backdrop-blur-sm border text-white/60 text-[15px] rounded-xl cursor-not-allowed"
                        style={{ borderColor: "rgba(255, 255, 255, 0.15)" }}
                      />
                    </div>
                  </div>

                  {/* Temporary Password */}
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="tempPassword"
                      className="text-[11px] font-bold uppercase tracking-[0.18em] transition-colors"
                      style={{
                        color: errors.tempPassword
                          ? "#f87171"
                          : "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      Temporary Password
                    </Label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors"
                        style={{
                          color: errors.tempPassword
                            ? "#f87171"
                            : "rgba(255, 255, 255, 0.5)",
                        }}
                      />
                      <Input
                        id="tempPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={tempPassword}
                        onChange={(e) => {
                          setTempPassword(e.target.value);
                          if (errors.tempPassword) {
                            setErrors((prev) => ({
                              ...prev,
                              tempPassword: undefined,
                            }));
                          }
                        }}
                        disabled={isPending}
                        className="h-12 pl-10 pr-12 bg-white/10 backdrop-blur-sm border text-white placeholder:text-white/40 text-[15px] focus:ring-4 transition-all rounded-xl"
                        style={{
                          borderColor: errors.tempPassword
                            ? "rgba(248, 113, 113, 0.5)"
                            : "rgba(255, 255, 255, 0.2)",
                          boxShadow: errors.tempPassword
                            ? "0 0 0 4px rgba(248, 113, 113, 0.1)"
                            : undefined,
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isPending}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.tempPassword && (
                      <p
                        className="text-[12px] font-bold"
                        style={{ color: "#f87171" }}
                      >
                        {errors.tempPassword}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="newPassword"
                      className="text-[11px] font-bold uppercase tracking-[0.18em] transition-colors"
                      style={{
                        color: errors.newPassword
                          ? "#f87171"
                          : "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      New Security Key
                    </Label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors"
                        style={{
                          color: errors.newPassword
                            ? "#f87171"
                            : "rgba(255, 255, 255, 0.5)",
                        }}
                      />
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (errors.newPassword) {
                            setErrors((prev) => ({
                              ...prev,
                              newPassword: undefined,
                            }));
                          }
                        }}
                        disabled={isPending}
                        className="h-12 pl-10 pr-12 bg-white/10 backdrop-blur-sm border text-white placeholder:text-white/40 text-[15px] focus:ring-4 transition-all rounded-xl"
                        style={{
                          borderColor: errors.newPassword
                            ? "rgba(248, 113, 113, 0.5)"
                            : "rgba(255, 255, 255, 0.2)",
                          boxShadow: errors.newPassword
                            ? "0 0 0 4px rgba(248, 113, 113, 0.1)"
                            : undefined,
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isPending}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.newPassword && (
                      <p
                        className="text-[12px] font-bold"
                        style={{ color: "#f87171" }}
                      >
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2.5">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-[11px] font-bold uppercase tracking-[0.18em] transition-colors"
                      style={{
                        color: errors.confirmPassword
                          ? "#f87171"
                          : "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      Confirm Security Key
                    </Label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors"
                        style={{
                          color: errors.confirmPassword
                            ? "#f87171"
                            : "rgba(255, 255, 255, 0.5)",
                        }}
                      />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) {
                            setErrors((prev) => ({
                              ...prev,
                              confirmPassword: undefined,
                            }));
                          }
                        }}
                        disabled={isPending}
                        className="h-12 pl-10 pr-12 bg-white/10 backdrop-blur-sm border text-white placeholder:text-white/40 text-[15px] focus:ring-4 transition-all rounded-xl"
                        style={{
                          borderColor: errors.confirmPassword
                            ? "rgba(248, 113, 113, 0.5)"
                            : "rgba(255, 255, 255, 0.2)",
                          boxShadow: errors.confirmPassword
                            ? "0 0 0 4px rgba(248, 113, 113, 0.1)"
                            : undefined,
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isPending}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p
                        className="text-[12px] font-bold"
                        style={{ color: "#f87171" }}
                      >
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#000053] text-white hover:bg-[#1a1a7a] font-bold text-[14px] uppercase tracking-[0.08em] shadow-2xl transition-all active:scale-[0.98] rounded-xl"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Initializing...</span>
                      </div>
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                </div>
              </form>

              <p className="text-center text-[14px] text-white/60">
                Already have credentials?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="font-semibold text-white hover:underline"
                >
                  Sign In Instead
                </button>
              </p>
            </div>
          </div>
        </section>
      </div>

      <Toast
        open={toastData.open}
        onOpenChange={(open) => setToastData((prev) => ({ ...prev, open }))}
        variant={toastData.variant}
        className="border-none shadow-2xl bg-white text-black rounded-xl"
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

      <ToastViewport />
    </ToastProvider>
  );
}
