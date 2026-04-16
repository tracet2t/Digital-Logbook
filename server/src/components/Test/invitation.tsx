// src/components/admin/TestInvitation.tsx
"use client";

import { useState } from "react";

import { useInvitation } from "@/_hooks/admin";

export function TestInvitation() {
  const { mutate, isPending } = useInvitation();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "student" as const,
    projectId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-6 border rounded-lg ">
      <h2 className="text-lg font-bold mb-4">Test Invitation</h2>

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <input
        type="text"
        placeholder="First Name"
        value={formData.firstName}
        onChange={(e) =>
          setFormData({ ...formData, firstName: e.target.value })
        }
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <input
        type="text"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        className="w-full mb-3 p-2 border rounded"
        required
      />

      <select
        value={formData.role}
        onChange={(e) =>
          setFormData({ ...formData, role: e.target.value as any })
        }
        className="w-full mb-3 p-2 border rounded"
      >
        <option value="student">Mentee</option>
        <option value="mentor">Mentor</option>
        <option value="superAdmin">Super Admin</option>
      </select>

      <input
        type="text"
        placeholder="Project ID (optional)"
        value={formData.projectId}
        onChange={(e) =>
          setFormData({ ...formData, projectId: e.target.value })
        }
        className="w-full mb-3 p-2 border rounded"
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Sending..." : "Send Invitation"}
      </button>
    </form>
  );
}
