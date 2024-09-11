// src/app/page.tsx
import TaskCalendar from "@/components/calendar";
// import { Button } from "antd";
// import Title from "antd/es/typography/Title";
import { getSession } from "@/server_actions/getSession";

export default async function Home() {
  const session = await getSession();
  const role = session?.getRole();

  return (
    <div className="p-6 h-[80vh] gap-4"> {/* Increased padding and set height to 80% of viewport height */}
      <div className="flex flex-col gap-8"> {/* Increased gap for more spacing */}
        {/* <Title level={3} className="mb-8">Dashboard</Title> Increased margin-bottom */}
        {/* <form action="/auth/logout" method="post">
          <Button htmlType="submit">Logout</Button>
        </form> */}
        <div className="flex flex-col flex-grow"> {/* Used flex-grow to take up available space */}
          {role === 'student' && <div className="text-sm text-green-700 mb-2">Student</div>}
          {role === 'mentor' && <div className="text-sm text-green-700 mb-2">Mentor</div>}
          {role === 'admin' && <div className="text-sm text-green-700 mb-2">Super Admin</div>}
        </div>
        <TaskCalendar />
      </div>
    </div>
  );
}
