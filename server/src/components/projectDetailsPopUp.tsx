"use client";

import React, { useState } from "react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProjectDetailsPopUpProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProjectDetailsPopUp: React.FC<ProjectDetailsPopUpProps> = ({ isOpen, onClose }) => {
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const submissions = [
        { id: 1, name: "Sarose", title: "Implemented real-time password validation", date: "Jan 11, 2025", status: "Pending" },
        { id: 2, name: "Lakshitha", title: "Added secure login authentication", date: "Jan 12, 2025", status: "Approved" },
        { id: 3, name: "Pamuda", title: "Improved database indexing", date: "Jan 13, 2025", status: "Rejected" },
        { id: 4, name: "Chamoth", title: "Improved UI/UX", date: "Jan 13, 2025", status: "Approved" },
    ];

    const filteredSubmissions = submissions.filter(
        (sub) =>
            (selectedStatus === "All" || sub.status === selectedStatus) &&
            sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-4xl w-full h-[520px] p-4 sm:p-6">
                {/* Header Section - Project Title and Mentor Info */}
                <AlertDialogHeader className="relative">
                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                        {/* Left side: Project Title, Mentor Info, Team Info */}
                        <div>
                            <AlertDialogTitle className="text-2xl font-bold">Project Digital Diary</AlertDialogTitle>
                            <div className="flex items-center space-x-2 mt-2">
                                {/* Mentor Avatar and Name */}
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src="/avatar.png" alt="User Avatar" />
                                    <AvatarFallback>M</AvatarFallback>
                                </Avatar>
                                <div className="text-sm text-gray-600">
                                    {/* Mentor's Name */}
                                    <p>Mentor: Jhon</p>
                                    {/* Team Name */}
                                    <p>Team: Web Development Rangers 2025</p>
                                </div>
                            </div>
                        </div>

                        {/* Right side: Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-0 right-0 mt-2 mr-4 text-gray-500 text-lg"
                        >
                            ✖
                        </button>
                    </div>
                </AlertDialogHeader>

                <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                    {/* Search Bar - Search for Student Name */}
                    <div className="flex-grow sm:w-[300px]">
                        <Input
                            placeholder="Search students..."
                            className="px-3 py-2 border rounded-md w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Filter Buttons - Filter by Submission Status */}
                    <div className="flex gap-2 flex-nowrap sm:ml-4 mt-3 sm:mt-0">
                        {["All", "Pending", "Approved", "Rejected"].map((status) => (
                            <Button
                                key={status}
                                variant={selectedStatus === status ? "default" : "outline"}
                                onClick={() => setSelectedStatus(status)}
                                className="px-4 py-2 text-sm"
                            >
                                {status}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Submissions List - List of Student Submissions */}
                <div className="space-y-4 overflow-y-auto h-[300px] pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                    {filteredSubmissions.length > 0 ? (
                        filteredSubmissions.map((sub) => (
                            <div key={sub.id} className="flex items-center bg-gray-100 p-3 rounded-md justify-between">
                                <div className="flex items-center space-x-3">
                                    {/* Student Avatar */}
                                    <Avatar>
                                        <AvatarImage src="/avatar.png" alt={sub.name} />
                                        <AvatarFallback>{sub.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        {/* Student Name */}
                                        <p className="font-semibold">{sub.name}</p>
                                        {/* Activity Title (Project Title) */}
                                        <p className="text-sm text-gray-600">{sub.title}</p>
                                        {/* Submission Date */}
                                        <p className="text-xs text-gray-500">Submitted on {sub.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-start">
                                    {/* Status Indicator */}
                                    <span
                                        className={`w-24 px-3 py-1 text-xs rounded-md text-center ${sub.status === "Approved" ? "bg-green-500 text-white"
                                            : sub.status === "Rejected" ? "bg-red-500 text-white"
                                                : "bg-gray-500 text-white"
                                            }`}
                                    >
                                        {sub.status}
                                    </span>
                                    {/* View Submission Button */}
                                    <AlertDialog>
                                        <AlertDialogTrigger>
                                            <Button variant="outline" className="ml-2">View Submission</Button>
                                        </AlertDialogTrigger>
                                    </AlertDialog>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-center items-center h-full text-gray-500">
                            No submissions found.
                        </div>
                    )}
                </div>

            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ProjectDetailsPopUp;
