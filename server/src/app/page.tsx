import TaskCalendar from "@/components/calendar";
import { Button } from "antd";
import Title from "antd/es/typography/Title";
import RegistrationForm from "@/components/mentorregister";

// This is a Server Component
export default async function Home() {
  // Example of async logic that should be in a Server Component
  // const session = await getSession(); // Server-side async call
  const role = "student"; // Replace with actual fetched data

  return (
    <div className="p-2">
      <div className="flex gap-2 justify-between">
        <Title level={3}>Dashboard</Title>
        <form action="/auth/logout" method="post">
          <Button htmlType="submit">Logout</Button>
        </form>
      </div>
      <div className="flex flex-col h-full">
        {role === "student" && <div className="text-sm text-green-700">Student</div>}
        {role === "mentor" && <div className="text-sm text-green-700">Mentor</div>}
        {role === "admin" && <div className="text-sm text-green-700">Super Admin</div>}
      </div>
      <TaskCalendar />

      {/* Button to trigger the Registration Form Modal */}
      <div className="mt-4">
        <Button type="primary">
          Register New Student
        </Button>
      </div>

      {/* Registration Form Modal */}
      <RegistrationForm isOpen={false} onClose={() => {}} /> {/* Update as needed */}
    </div>
  );
}
