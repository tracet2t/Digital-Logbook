"use client";

import React, { useEffect, useState } from "react";

import { getSessionOnClient } from "@/server_actions/getSession";

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
    <div className="min-h-screen bg-[#f1f1f9] p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-[95vw] flex-col">
        <div className="min-h-[60vh] w-full rounded-xl bg-white p-4 shadow-lg">
          <div className="flex w-full items-center justify-center">
            <RsuiteCalendar selectedUser={selectedUser || ""} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
