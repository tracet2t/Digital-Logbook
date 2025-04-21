import React from 'react';
import Navbar from '@/components/navBar';
import DashboardOverview from '@/components/dashboardOverview';
import ActiveProjects from '@/components/activeProjects';
import PersonalJournal from '@/components/personalJournal';
import Calendar from '@/components/newCalendar';
import Footer from '@/components/footer';

const MentorDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {/* Left Panel - Dashboard Overview & Active Projects */}
        <div className="col-span-2">
          <DashboardOverview />
          <div className="mt-4"> <ActiveProjects /></div>
        </div>

        {/* Right Panel - Calendar & Journal */}
        <div className="flex flex-col gap-4">
          <Calendar />
          <PersonalJournal />
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MentorDashboard;
