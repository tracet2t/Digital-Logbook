"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function CreateAccount() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!tempPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/complete-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, tempPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          "Account created successfully! Please login with your new password.",
        );
        router.push(`/login?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(data.error || "Failed to complete registration");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-[420px]">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create Your Account
        </h1>

        <input
          value={email}
          disabled
          className="border p-2 w-full mb-3 rounded bg-gray-200 cursor-not-allowed"
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Temporary Password"
          className="border p-2 w-full mb-3 rounded"
          value={tempPassword}
          onChange={(e) => setTempPassword(e.target.value)}
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="New Password"
          className="border p-2 w-full mb-3 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          className="border p-2 w-full mb-3 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            onChange={() => setShowPassword(!showPassword)}
          />
          <span className="ml-2 text-sm">Show Password</span>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
}
