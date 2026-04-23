"use client";

import React, { useEffect, useState } from "react";

import { getSessionOnClient } from "@/server_actions/getSession";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/admin";
import RsuiteCalendar from "@/components/rsuiteCalendar";

interface SessionData {
  id: string;
  fname: string;
  lname: string;
  email: string;
}

const StudentPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    getSessionOnClient()
      .then((data: SessionData | null) => {
        if (data) {
          setSelectedUser(data.id);
        }
      })
      .catch((error) => {
        console.error("Error fetching session:", error);
      });
  }, []);

  return (
    <div className="min-h-svh bg-[#f1f1f9] p-3 sm:p-4 md:p-6">
      <div className="flex min-h-[calc(100svh-1.5rem)] w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg sm:min-h-[calc(100svh-2rem)] md:min-h-[calc(100svh-3rem)]">
        <div className="border-b border-slate-200 p-4 md:p-6">
          <PageHeader title="Monthly Attendance" />
          <p className="mt-1 text-sm text-slate-500">
            Review and log your project hours for the current cycle.
          </p>
        </div>

        <div className="w-full p-3 sm:p-4 md:p-6">
          <Card className="w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:p-3 md:p-4">
            <div className="w-full">
              <RsuiteCalendar selectedUser={selectedUser || ""} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
