// app/mentor/page.tsx
"use client";

// This file needs to use some client-side logic for pop-up control
import { redirect } from "next/navigation";

export default function MentorPage() {
  redirect("/mentor/dashboard");
  return null;
}
