"use client";

import React from "react";

import { useOnboarding } from "@/_hooks/onboarding/useOnboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookOpenText,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  Link as LinkIcon,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  nic: z.string().min(1, "NIC number is required."),
  mobileNumber: z
    .string()
    .min(1, "Mobile number is required.")
    .regex(/^[0-9+\s\-()]{7,20}$/, "Please enter a valid mobile number."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  university: z.string().min(2, "University is required."),
  degreeProgram: z.string().min(2, "Degree program is required."),
  cvLink: z
    .string()
    .url("Please enter a valid URL.")
    .refine(
      (value) =>
        value.includes("drive.google.com") || value.includes("docs.google.com"),
      "Use a Google Drive or Docs link for the CV.",
    ),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateAccountShowcasePage() {
  const onboardingMutation = useOnboarding();
  const [shake, setShake] = React.useState(false);
  const [onboardingSuccess, setOnboardingSuccess] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      nic: "",
      mobileNumber: "",
      address: "",
      university: "",
      degreeProgram: "",
      cvLink: "",
    },
  });

  const handleSubmit = async (values: FormData) => {
    setOnboardingSuccess(false);
    onboardingMutation.mutate(values, {
      onSuccess: () => {
        setOnboardingSuccess(true);
        setTimeout(() => {
          form.reset();
          setOnboardingSuccess(false);
        }, 1500);
      },
      onError: () => {
        setShake(true);
        setTimeout(() => setShake(false), 600);
      },
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
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
      <div className="flex min-h-screen w-full overflow-hidden bg-white dark:bg-zinc-950">
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

        <section
          className="flex-1 flex flex-col items-center justify-center p-5 md:p-5 "
          style={{
            backgroundImage:
              "linear-gradient(135deg, #0e131b 0%, #0b0c10 33%, #0c0c11 66%, #0a0b10 100%)",
          }}
        >
          <div
            className={`flex-1 flex flex-col items-center justify-center p-16 md:p-24 w-full rounded-3xl backdrop-blur-md border shadow-2xl transition-all duration-300 ${Object.keys(form.formState.errors).length > 0 && shake ? "shake-animation" : ""}`}
            style={{
              backgroundColor: onboardingSuccess
                ? "rgba(34, 197, 94, 0.1)"
                : Object.keys(form.formState.errors).length > 0
                  ? "rgba(248, 113, 113, 0.1)"
                  : "rgba(255, 255, 255, 0.1)",
              borderColor: onboardingSuccess
                ? "rgba(34, 197, 94, 0.5)"
                : Object.keys(form.formState.errors).length > 0
                  ? "rgba(248, 113, 113, 0.3)"
                  : "rgba(255, 255, 255, 0.2)",
            }}
          >
            <div className="w-full max-w-[520px] space-y-8">
              <div className="mb-10 space-y-2 text-left">
                <h2 className="text-4xl font-black tracking-tight text-white">
                  Register as a Mentee
                </h2>
                <p className="text-[15px] text-white/70">
                  Enter your details to begin your journey.
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit, () => {
                    setShake(true);
                    setTimeout(() => setShake(false), 600);
                  })}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="text-[11px] font-bold uppercase tracking-[0.18em] transition-colors"
                          style={{
                            color: form.formState.errors.fullName
                              ? "#f87171"
                              : "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User
                              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors"
                              style={{
                                color: form.formState.errors.fullName
                                  ? "#f87171"
                                  : "rgba(255, 255, 255, 0.5)",
                              }}
                            />
                            <Input
                              {...field}
                              placeholder="Alexander Hamilton"
                              className="h-12 bg-white/10 backdrop-blur-sm border text-white placeholder:text-white/40 pl-10 text-[15px] focus:ring-4 transition-all rounded-xl"
                              style={{
                                borderColor: form.formState.errors.fullName
                                  ? "rgba(248, 113, 113, 0.5)"
                                  : "rgba(255, 255, 255, 0.2)",
                                boxShadow: form.formState.errors.fullName
                                  ? "0 0 0 4px rgba(248, 113, 113, 0.1)"
                                  : undefined,
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage
                          className="text-[12px] font-bold"
                          style={{ color: "#f87171" }}
                        />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="text-[11px] font-bold uppercase tracking-[0.18em] transition-colors"
                          style={{
                            color: form.formState.errors.email
                              ? "#f87171"
                              : "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail
                              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors"
                              style={{
                                color: form.formState.errors.email
                                  ? "#f87171"
                                  : "rgba(255, 255, 255, 0.5)",
                              }}
                            />
                            <Input
                              type="email"
                              {...field}
                              placeholder="alex@university.edu"
                              className="h-12 bg-white/10 backdrop-blur-sm border text-white placeholder:text-white/40 pl-10 text-[15px] focus:ring-4 transition-all rounded-xl"
                              style={{
                                borderColor: form.formState.errors.email
                                  ? "rgba(248, 113, 113, 0.5)"
                                  : "rgba(255, 255, 255, 0.2)",
                                boxShadow: form.formState.errors.email
                                  ? "0 0 0 4px rgba(248, 113, 113, 0.1)"
                                  : undefined,
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage
                          className="text-[12px] font-bold"
                          style={{ color: "#f87171" }}
                        />
                      </FormItem>
                    )}
                  />

                  {/* NIC */}
                  <FormField
                    control={form.control}
                    name="nic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="text-[11px] font-bold uppercase tracking-[0.18em] transition-colors"
                          style={{
                            color: form.formState.errors.nic
                              ? "#f87171"
                              : "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          NIC Number
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CreditCard
                              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors"
                              style={{
                                color: form.formState.errors.nic
                                  ? "#f87171"
                                  : "rgba(255, 255, 255, 0.5)",
                              }}
                            />
                            <Input
                              {...field}
                              placeholder="200012345678"
                              className="h-12 bg-white/10 backdrop-blur-sm border text-white placeholder:text-white/40 pl-10 text-[15px] focus:ring-4 transition-all rounded-xl"
                              style={{
                                borderColor: form.formState.errors.nic
                                  ? "rgba(248, 113, 113, 0.5)"
                                  : "rgba(255, 255, 255, 0.2)",
                                boxShadow: form.formState.errors.nic
                                  ? "0 0 0 4px rgba(248, 113, 113, 0.1)"
                                  : undefined,
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage
                          className="text-[12px] font-bold"
                          style={{ color: "#f87171" }}
                        />
                      </FormItem>
                    )}
                  />

                  {/* Mobile & Address side-by-side on sm+ */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="mobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className="text-[11px] font-bold uppercase tracking-[0.18em] transition-colors"
                            style={{
                              color: form.formState.errors.mobileNumber
                                ? "#f87171"
                                : "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            Mobile Number
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors"
                                style={{
                                  color: form.formState.errors.mobileNumber
                                    ? "#f87171"
                                    : "rgba(255, 255, 255, 0.5)",
                                }}
                              />
                              <Input
                                {...field}
                                placeholder="+94 71 234 5678"
                                className="h-12 bg-white/10 backdrop-blur-sm border text-white placeholder:text-white/40 pl-10 text-[15px] focus:ring-4 transition-all rounded-xl"
                                style={{
                                  borderColor: form.formState.errors
                                    .mobileNumber
                                    ? "rgba(248, 113, 113, 0.5)"
                                    : "rgba(255, 255, 255, 0.2)",
                                  boxShadow: form.formState.errors.mobileNumber
                                    ? "0 0 0 4px rgba(248, 113, 113, 0.1)"
                                    : undefined,
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage
                            className="text-[12px] font-bold"
                            style={{ color: "#f87171" }}
                          />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className="text-[11px] font-bold uppercase tracking-[0.18em] transition-colors"
                            style={{
                              color: form.formState.errors.address
                                ? "#f87171"
                                : "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            Address
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors"
                                style={{
                                  color: form.formState.errors.address
                                    ? "#f87171"
                                    : "rgba(255, 255, 255, 0.5)",
                                }}
                              />
                              <Input
                                {...field}
                                placeholder="123 Main St, Colombo 07"
                                className="h-12 bg-white/10 backdrop-blur-sm border text-white placeholder:text-white/40 pl-10 text-[15px] focus:ring-4 transition-all rounded-xl"
                                style={{
                                  borderColor: form.formState.errors.address
                                    ? "rgba(248, 113, 113, 0.5)"
                                    : "rgba(255, 255, 255, 0.2)",
                                  boxShadow: form.formState.errors.address
                                    ? "0 0 0 4px rgba(248, 113, 113, 0.1)"
                                    : undefined,
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage
                            className="text-[12px] font-bold"
                            style={{ color: "#f87171" }}
                          />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="university"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className="text-[11px] font-bold uppercase tracking-[0.18em] transition-colors"
                            style={{
                              color: form.formState.errors.university
                                ? "#f87171"
                                : "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            University
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <GraduationCap
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors"
                                style={{
                                  color: form.formState.errors.university
                                    ? "#f87171"
                                    : "rgba(255, 255, 255, 0.5)",
                                }}
                              />
                              <Input
                                {...field}
                                placeholder="State University"
                                className="h-12 bg-white/10 backdrop-blur-sm border text-white placeholder:text-white/40 pl-10 text-[15px] focus:ring-4 transition-all rounded-xl"
                                style={{
                                  borderColor: form.formState.errors.university
                                    ? "rgba(248, 113, 113, 0.5)"
                                    : "rgba(255, 255, 255, 0.2)",
                                  boxShadow: form.formState.errors.university
                                    ? "0 0 0 4px rgba(248, 113, 113, 0.1)"
                                    : undefined,
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage
                            className="text-[12px] font-bold"
                            style={{ color: "#f87171" }}
                          />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="degreeProgram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className="text-[11px] font-bold uppercase tracking-[0.18em] transition-colors"
                            style={{
                              color: form.formState.errors.degreeProgram
                                ? "#f87171"
                                : "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            Degree Program
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <BookOpenText
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors"
                                style={{
                                  color: form.formState.errors.degreeProgram
                                    ? "#f87171"
                                    : "rgba(255, 255, 255, 0.5)",
                                }}
                              />
                              <Input
                                {...field}
                                placeholder="B.S. Computer Science"
                                className="h-12 bg-white/10 backdrop-blur-sm border text-white placeholder:text-white/40 pl-10 text-[15px] focus:ring-4 transition-all rounded-xl"
                                style={{
                                  borderColor: form.formState.errors
                                    .degreeProgram
                                    ? "rgba(248, 113, 113, 0.5)"
                                    : "rgba(255, 255, 255, 0.2)",
                                  boxShadow: form.formState.errors.degreeProgram
                                    ? "0 0 0 4px rgba(248, 113, 113, 0.1)"
                                    : undefined,
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage
                            className="text-[12px] font-bold"
                            style={{ color: "#f87171" }}
                          />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="cvLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="text-[11px] font-bold uppercase tracking-[0.18em] transition-colors"
                          style={{
                            color: form.formState.errors.cvLink
                              ? "#f87171"
                              : "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          Google Drive Link for CV
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <LinkIcon
                              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors"
                              style={{
                                color: form.formState.errors.cvLink
                                  ? "#f87171"
                                  : "rgba(255, 255, 255, 0.5)",
                              }}
                            />
                            <Input
                              type="url"
                              {...field}
                              placeholder="https://drive.google.com/..."
                              className="h-12 bg-white/10 backdrop-blur-sm border text-white placeholder:text-white/40 pl-10 text-[15px] focus:ring-4 transition-all rounded-xl"
                              style={{
                                borderColor: form.formState.errors.cvLink
                                  ? "rgba(248, 113, 113, 0.5)"
                                  : "rgba(255, 255, 255, 0.2)",
                                boxShadow: form.formState.errors.cvLink
                                  ? "0 0 0 4px rgba(248, 113, 113, 0.1)"
                                  : undefined,
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-[12px] text-white/60">
                          Ensure the link visibility is set to &quot;Anyone with
                          the link&quot;.
                        </FormDescription>
                        <FormMessage
                          className="text-[12px] font-bold"
                          style={{ color: "#f87171" }}
                        />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4 pt-4">
                    <Button
                      type="submit"
                      disabled={
                        onboardingMutation.isPending || onboardingSuccess
                      }
                      className={`h-12 w-full rounded-xl text-[14px] font-bold uppercase tracking-[0.08em] shadow-2xl transition-all active:scale-[0.98] ${
                        Object.keys(form.formState.errors).length > 0
                          ? "bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600"
                          : onboardingSuccess
                            ? "bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-600"
                            : "bg-[#000053] text-white hover:bg-[#1a1a7a]"
                      }`}
                    >
                      {onboardingSuccess ? (
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-6 w-6" />
                          <span>DONE</span>
                        </div>
                      ) : onboardingMutation.isPending ? (
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span>Submitting...</span>
                        </div>
                      ) : Object.keys(form.formState.errors).length > 0 ? (
                        <div className="flex items-center gap-3">
                          <span>TRY AGAIN</span>
                        </div>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>

              <p className="mt-10 text-center text-[14px] text-white/60">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-white hover:underline"
                >
                  Log in here
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
