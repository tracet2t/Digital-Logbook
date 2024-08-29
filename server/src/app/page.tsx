// import TaskCalendar from "@/components/calendar";
import MentorDashboard from "@/components/mentorDashboard/mentorDashboard";
import { Button } from "antd";
import Title from "antd/es/typography/Title";

export default function Home() {
  return (
    <div className="p-2">
      <div className="flex gap-2 justify-between">
        <Title level={3}>Dashboard</Title>
        <form action="/auth/logout" method="post">
          <Button htmlType="submit">Logout</Button>
        </form>
      </div>
      <MentorDashboard />
      {/* <TaskCalendar /> */}
    </div>
  );
}
