// components/DashboardOverview.tsx
import getSession from '@/server_actions/getSession';
import React, { useEffect, useState } from 'react';

interface Project {
  projectTitle: string;
  progress: number;
  deadline: string;
  teamName: string;
  students: {
    userID: string;
    user: {
      firstName: string;
      lastName: string;
    };
  }[];
}

interface Activity {
  id: string;
  timeSpent: number;
  notes: string;
  student: {
    firstName: string;
    lastName: string;
  };
}

interface DashboardStats {
  numberOfProjects: number;
  numberOfStudents: number;
  totalActivitiesThisWeek: number;
}

const DashboardOverview = () => {


  
  const getDashboardData = async() => {
    const res = await fetch('/api/mentor/dashboard');
    const { projects, recentActivities, stats } = await res.json();

  }

  const [projects, setProjects] = useState<Project[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/mentor/dashboard");
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const data = await res.json();
        setProjects(data.projects);
        setRecentActivities(data.recentActivities);
        setStats(data.stats);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  
  

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
