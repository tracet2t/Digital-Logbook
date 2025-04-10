import React from "react";

interface DashboardOverviewProps {
  userType: "mentor" | "student"; // Determines dashboard type
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ userType }) => {
  // Data for mentor and student dashboards
  const dashboardData = userType === "mentor"
    ? [
      { title: "Total Projects", icon: "📁", colorClass: "text-blue-500", status: "Current assigned", number: 2 },
      { title: "Pending Approval", icon: "⏳", colorClass: "text-yellow-500", status: "Awaiting review", number: 4 },
      { title: "Approved Activities", icon: "✔️", colorClass: "text-green-500", status: "Successfully complete", number: 6 },
      { title: "Rejected Activities", icon: "❌", colorClass: "text-red-500", status: "Need revisions", number: 5 }
    ]
    : [
      { title: "Total Activities", icon: "📑", colorClass: "text-blue-500", status: "Current total activities", number: 10 },
      { title: "Pending Approval", icon: "⏳", colorClass: "text-yellow-500", status: "Awaiting review", number: 3 },
      { title: "Approved Activities", icon: "✔️", colorClass: "text-green-500", status: "Successfully complete", number: 8 },
      { title: "Rejected Activities", icon: "❌", colorClass: "text-red-500", status: "Need revisions", number: 2 }
    ];

  return (
    <div className="bg-white p-4 rounded-md shadow-md w-full max-w-[800px] h-auto">
      <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {dashboardData.map((item, index) => (
          <div key={index} className="bg-[#E3E3E3] p-4 w-[180px] h-[120px] rounded-md shadow-md text-left flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className={`text-2xl ${item.colorClass}`}>{item.icon}</div>
              <div className="text-xl font-bold">{item.number}</div>
            </div>
            <p className="text-md font-semibold">{item.title}</p>
            <p className="text-xs text-gray-500">{item.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardOverview;