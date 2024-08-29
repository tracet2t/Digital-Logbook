import TaskCalendar from "@/components/calendar";
import { Button } from "antd";
import Title from "antd/es/typography/Title";

export default function Home() {
  return (
    <div className="p-2">
      <div className="flex gap-2 justify-between">
        <Title level={3} className="mt-12"> {/* Adjust margin-top to move the title down */}
          Dashboard
        </Title>

        {/* Uncomment and use this form for logout if needed */}
        {/* <form action="/auth/logout" method="post">
          <Button htmlType="submit">Logout</Button>
        </form> */}
      </div>
      <TaskCalendar />
    </div>
  );
}
