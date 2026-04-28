"use client";

import { useOnboarding } from "@/_hooks/onboarding/useOnboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookOpenText,
  CheckCircle2,
  GraduationCap,
  Link as LinkIcon,
  Mail,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
const ONBOARDING_EMAIL_STORAGE_KEY = "onboardingSubmittedEmail";

export default function CreateAccountShowcasePage() {
  const onboardingMutation = useOnboarding();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      university: "",
      degreeProgram: "",
      cvLink: "",
    },
  });

  useEffect(() => {
    let isMounted = true;

    const hydrateSubmissionState = async () => {
      const savedEmail = localStorage.getItem(ONBOARDING_EMAIL_STORAGE_KEY);
      if (!savedEmail) {
        return;
      }

      try {
        const response = await fetch(
          `/api/onboarding?email=${encodeURIComponent(savedEmail)}`,
        );

        if (response.ok && isMounted) {
          setIsSubmitted(true);
          return;
        }
      } catch (error) {
        console.error("Failed to restore onboarding status:", error);
      }

      localStorage.removeItem(ONBOARDING_EMAIL_STORAGE_KEY);
    };

    hydrateSubmissionState();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (values: FormData) => {
    try {
      await onboardingMutation.mutateAsync(values);
      localStorage.setItem(ONBOARDING_EMAIL_STORAGE_KEY, values.email);
      setIsSubmitted(true);
    } catch {
      // Toast handling is managed by the mutation hook; keep form visible.
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="flex min-h-screen w-full overflow-hidden bg-white dark:bg-zinc-950">
        <aside className="relative hidden w-[50%] overflow-hidden border-r border-zinc-800 bg-zinc-900 p-12 text-white lg:flex lg:flex-col xl:p-14">
          <Image
            src="/login.png"
            alt="Product Visual"
            fill
            className="object-cover opacity-40 mix-blend-soft-light"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-zinc-950/80" />

          <div className="relative z-10 w-fit rounded-sm bg-white px-3 py-2">
            <Image
              src="/logo.png"
              width={118}
              height={30}
              alt="Digital Logbook"
              className="h-auto w-auto"
              priority
            />
          </div>

          <div className="relative z-10 mb-auto mt-auto">
            <h1 className="text-[82px] font-black leading-[0.9] tracking-[-0.03em]">
              Build
              <br />
              <span className="text-[#2f66ff] underline decoration-[#2f66ff] underline-offset-[8px]">
                Your
              </span>
              <br />
              Future.
            </h1>
            <p className="mt-8 max-w-[420px] text-[30px] leading-snug text-[#d7d8e8]">
              Learn new skills and track your progress step by step.
            </p>
          </div>

          <div className="relative z-10 mt-auto flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-[#76789b]">
            <span>© 2026 T2T</span>
            <span>Secure Access</span>
          </div>
        </aside>

        <section className="flex flex-1 items-center justify-center bg-white px-6 py-10 sm:px-10 lg:px-16 xl:px-24 dark:bg-zinc-950">
          <div className="w-full max-w-[520px]">
            <div className="mb-10 space-y-2 text-left">
              <h2 className="text-4xl font-black tracking-tight text-[#141414]">
                Create Account
              </h2>
              <p className="text-[15px] text-[#6b6f76]">
                Enter your details to begin your journey.
              </p>
            </div>

            {isSubmitted ? (
              <div
                className="relative overflow-hidden rounded-[14px] border border-[#d6deef] bg-gradient-to-br from-[#fcfdff] via-[#f5f8ff] to-[#eef4ff] p-7 shadow-[0_8px_26px_-22px_rgba(15,23,42,0.35)]"
                style={{ animation: "softFadeIn 360ms ease-out both" }}
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#dbeafe]/50 blur-2xl" />
                <div className="relative">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#b7ebcb] bg-[#eafaf1] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#2d7a4b]">
                    <CheckCircle2
                      className="h-4 w-4"
                      style={{ animation: "softCheckPop 280ms ease-out" }}
                    />
                    Submission Received
                  </div>
                  <h3 className="text-[29px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#2f3640]">
                    Your onboarding has been successfully submitted.
                  </h3>
                  <p className="mt-4 text-[15px] font-medium text-[#4a5563]">
                    We will get back to you soon.
                  </p>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#868b94]">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f949e]" />
                            <Input
                              {...field}
                              placeholder="Alexander Hamilton"
                              className="h-12 border-[#d9dde4] bg-white pl-10 text-[15px]"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[12px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#868b94]">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f949e]" />
                            <Input
                              type="email"
                              {...field}
                              placeholder="alex@university.edu"
                              className="h-12 border-[#d9dde4] bg-white pl-10 text-[15px]"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[12px]" />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="university"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#868b94]">
                            University
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <GraduationCap className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f949e]" />
                              <Input
                                {...field}
                                placeholder="State University"
                                className="h-12 border-[#d9dde4] bg-white pl-10 text-[15px]"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[12px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="degreeProgram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#868b94]">
                            Degree Program
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <BookOpenText className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f949e]" />
                              <Input
                                {...field}
                                placeholder="B.S. Computer Science"
                                className="h-12 border-[#d9dde4] bg-white pl-10 text-[15px]"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[12px]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="cvLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#868b94]">
                          Google Drive Link for CV
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f949e]" />
                            <Input
                              type="url"
                              {...field}
                              placeholder="https://drive.google.com/..."
                              className="h-12 border-[#d9dde4] bg-white pl-10 text-[15px]"
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-[12px] text-[#9aa0aa]">
                          Ensure the link visibility is set to &quot;Anyone with
                          the link&quot;.
                        </FormDescription>
                        <FormMessage className="text-[12px]" />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4 pt-4">
                    <Button
                      type="submit"
                      disabled={onboardingMutation.isPending}
                      className="h-12 w-full rounded-md bg-[#0a0d7a] text-[14px] font-bold uppercase tracking-[0.08em] text-white hover:bg-[#080a5f]"
                    >
                      {onboardingMutation.isPending
                        ? "Submitting..."
                        : "Create Mentee"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}

            <p className="mt-10 text-center text-[14px] text-[#7f848d]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#0a0d7a] hover:underline"
              >
                Log in here
              </Link>
            </p>
          </div>
        </section>
      </div>
      <style jsx>{`
        @keyframes softFadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes softCheckPop {
          from {
            transform: scale(0.85);
            opacity: 0.7;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
