"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function PasswordResetPage() {
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const emailFromUrl = queryParams.get("email");

    if (emailFromUrl) {
      setEmail(decodeURIComponent(emailFromUrl));
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/auth/passwordChange", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      if (!response.ok) throw new Error("Password reset failed");

      toast.success("Password has been reset");

      // Clear the text boxes
      setNewPassword("");
      setConfirmPassword("");

      router.push("/auth/login");
    } catch (err) {
      setError("An error occurred");
      toast.error("An error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              readOnly
            />
          </div>
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
