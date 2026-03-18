"use client";

import { useEffect, useState } from "react";
import getSession from "@/server_actions/getSession";

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const session = await getSession();
        if (session.isAuthenticated()) {
          const userData = {
            id: session.getId(),
            email: session.getUsername(),
            firstName: session.getName()?.split(" ")[0] || "",
            lastName: session.getName()?.split(" ")[1] || "",
            role: session.getRole(),
          };
          setUser(userData as AdminUser);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {user?.firstName || "Admin"}
              </p>
            </div>
            <form action="/api/logout" method="post">
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </form>
          </div>

          {/* Admin Info Card */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Admin Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-lg font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-medium text-gray-900">
                  {user?.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="text-lg font-medium text-blue-600 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Users Management */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Users</p>
                  <p className="text-3xl font-bold text-gray-900">--</p>
                </div>
                <div className="text-4xl text-blue-500">👥</div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium">
                Manage Users
              </button>
            </div>

            {/* Activities */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Activities</p>
                  <p className="text-3xl font-bold text-gray-900">--</p>
                </div>
                <div className="text-4xl text-green-500">📊</div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition font-medium">
                View Activities
              </button>
            </div>

            {/* Reports */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reports</p>
                  <p className="text-3xl font-bold text-gray-900">--</p>
                </div>
                <div className="text-4xl text-purple-500">📄</div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition font-medium">
                View Reports
              </button>
            </div>
          </div>

          {/* Placeholder for More Content */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Activities
            </h2>
            <p className="text-gray-600">
              Admin activity logs and recent actions will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
