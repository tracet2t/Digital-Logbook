import React from "react";

type Activity = {
  id: number;
  status: "approved" | "pending" | "rejected";
  message: string;
};

// Mock data (to be received from parent component)
const mockActivities: Activity[] = [
  { id: 1, status: "approved", message: "Made minor updates and improvements." },
  { id: 2, status: "pending", message: "Fixed the bug and pushed the update to the Git branch" },
  { id: 3, status: "rejected", message: "Something went wrong during deployment." },
];

type Props = {
  selectedDate: string; // Date is received from another component
  activities: Activity[]; // Activities are received dynamically
};

const Activity: React.FC<Props> = ({ selectedDate, activities }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-3xl mx-auto border">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-center border-b pb-2 mb-2">
        <h2 className="font-semibold text-lg flex items-center gap-2">📄 Today Activities</h2>
        <span className="font-semibold">{selectedDate}</span>
      </div>

      {/* Activity List (Fixed Height) */}
      <div className="bg-white max-h-44 min-h-44 overflow-y-auto w-full">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-center gap-3 p-3 mb-2 rounded-lg transition-all duration-200 border-2 border-transparent
                            ${activity.status === "approved" ? "hover:border-green-300" : ""}
                            ${activity.status === "rejected" ? "hover:border-red-300" : ""}
                            ${activity.status === "pending" ? "hover:border-yellow-300" : ""}`}
            >
              {/* Status Icon */}
              {activity.status === "approved" && <span className="w-5 text-green-600">✅</span>}
              {activity.status === "pending" && <span className="w-6 text-yellow-600">⏳</span>}
              {activity.status === "rejected" && <span className="w-5 text-red-600">❌</span>}
              {/* Message */}
              <p className="text-gray-700 text-sm">{activity.message}</p>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No activities found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Example usage with mock data
const ParentComponent = () => {
  const selectedDate = "03/13/2025"; // Date from another component
  return <Activity selectedDate={selectedDate} activities={mockActivities} />;
};

export default ParentComponent;