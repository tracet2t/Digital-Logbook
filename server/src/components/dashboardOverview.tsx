// components/DashboardOverview.tsx
import React from 'react';

const DashboardOverview = () => {
  return (
    <div className="bg-white p-4 rounded-md shadow-md">
    <div className="grid grid-cols-4 gap-4 mb-6">
      <h2 className="col-span-4 text-xl font-semibold mb-4">Dashboard Overview</h2>
      {["Total Projects", "Pending Approval", "Approved Activities", "Rejected Activities"].map((title, index) => {
        let icon;
        let colorClass;
        let status;
        let number;

        if (title === "Rejected Activities") {
          icon = "❌";
          colorClass = "text-red-500";
          status = "Need revisions";
          number = 5;
        } else if (title === "Approved Activities") {
          icon = "✔️";
          colorClass = "text-green-500";
          status = "Successfully complete";
          number = 6;
        } else if (title === "Pending Approval") {
          icon = "⏳";
          colorClass = "text-yellow-500";
          status = "Awaiting review";
          number = 4;
        } else {
          icon = "📁";
          colorClass = "text-blue-500";
          status = "Current assigned";
          number = 2;
        }

        return (
          <div 
          key={index} 
          className="bg-gray-100 p-4 rounded-md shadow-md text-center flex flex-col"
        >
            
            <div className={`text-3xl ${colorClass} mb-2`}>{icon}</div>
            
            <p className="text-lg font-semibold">{title}</p>
            
            <div className="mt-2">
              <p className="text-sm text-gray-500">{status}</p>
            </div>
            <div className="flex justify-center text-2xl font-bold mb-2">{number}</div>
          </div>
        );
      })}
    </div>
  </div>
  );
};

export default DashboardOverview;
