`use client`

import TaskCalendar from "@/components/calendar";
import { Button } from "antd";
import Title from "antd/es/typography/Title";
import { getSession } from "@/server_actions/getSession";

export default async function Home() {
  const session = await getSession();

    const role = session?.getRole();

    return (
        <div className="p-2">
            <div className="flex gap-2 justify-between">
                <Title level={3}>Dashboard</Title>
                <form action="/auth/logout" method="post">
                    <Button htmlType="submit">Logout</Button>
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
