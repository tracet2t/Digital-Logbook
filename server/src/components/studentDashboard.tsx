import React, { useState } from "react";
import Navbar from "@/components/navBar";
import DashboardOverview from "@/components/STdashboardOverview";
import Calendar from "@/components/STCalendar";
import Footer from "@/components/footer";
import RecentReviews from "./recentReviews";
import Activity from "./activity";
import AddNewActivity from "./addNewActivity";
import UpdateActivity from "./updateActivity";

const StudentDashboard = () => {
    const [isAddNewActivityOpen, setIsAddNewActivityOpen] = useState(false);
    const openAddNewActivity = () => setIsAddNewActivityOpen(true);
    const closeAddNewActivity = () => setIsAddNewActivityOpen(false);

    const [isUpdateActivityOpen, setIsUpdateActivityOpen] = useState(false);
    const openUpdateActivity = () => setIsUpdateActivityOpen(true);
    const closeUpdateActivity = () => setIsUpdateActivityOpen(false);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Navbar */}
            <Navbar userType="student" userName="Jane Doe" />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 px-4 flex-grow">
                {/* Left Section */}
                <div className="md:col-span-2 space-y-2">
                    <DashboardOverview userType="student" />
                    <RecentReviews onAddNewActivity={openAddNewActivity} onUpdateActivity={openUpdateActivity} />
                </div>

                {/* Right Section */}
                <div className="flex flex-col space-y-4 w-full">
                    <Calendar />
                    <Activity />
                </div>
            </div>

            {/* Footer */}
            <Footer />

            {/* Modals */}
            <AddNewActivity isOpen={isAddNewActivityOpen} onClose={closeAddNewActivity} />
            <UpdateActivity isOpen={isUpdateActivityOpen} onClose={closeUpdateActivity} />
        </div>
    );
};

export default StudentDashboard;
