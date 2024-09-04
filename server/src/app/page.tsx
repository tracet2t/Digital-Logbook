`use client`

import TaskCalendar from "@/components/calendar";
import { getSession } from "@/server_actions/getSession";

export default async function Home() {
    const session = await getSession();
  
    const role = session?.getRole();
  
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
        <TaskCalendar />
      </div>
    );
  }