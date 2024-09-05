"use server"

// import { useState, useEffect } from 'react';
import TaskCalendar from "@/components/calendar";
// import { getSessionOnClient } from "@/server_actions/getSession";
import getSession from '@/server_actions/getSession';


export default async function Home() {
//   const [session, setSession] = useState(null);
//   const [role, setRole] = useState(null);

  const role = (await getSession()).getRole();
  console.log(role);


//   useEffect(() => {
//     getSessionOnClient()
//       .then((data) => {
//         setSession(data);
//         setRole(data.role);
//       })
//       .catch((error) => {
//         console.error('Error fetching session:', error);
//       });
//   }, []);

  return (
      <div className="p-2">
        <div className="flex gap-2 justify-between">
          <h1>Dashboard</h1>
          <form action="/auth/logout" method="post">
            <button type="submit">Logout</button>
          </form>
        </div>
        <div className="flex flex-col h-full">
          {role === 'student' && <div className="text-sm text-green-700">Student</div>}
          {role === 'mentor' && <div className="text-sm text-green-700">Mentor</div>}
          {role === 'admin' && <div className="text-sm text-green-700">Super Admin</div>}
        </div>
      </div>
    );
  }