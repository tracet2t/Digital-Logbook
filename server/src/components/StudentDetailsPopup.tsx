"use client";

import React, { useState, useMemo } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter } from "lucide-react";
import StudentPersonalDetails from "./StudentPersonalDetails"; // Importing the StudentPersonalDetails component
import AddNewStudentPopup from "./AddNewStudentPopup"; // Import AddNewStudentPopup

interface Student {
    id: number;
    name: string;
    projects: string;
    approved: number;
    rejected: number;
    avatar: string;
    location: string;
    dob: string;
    university: string;
    academicYear: string;
    linkedin: string;
    github: string;
    status: string;
    enrolledDate: string;
    endDate: string;
}

interface StudentDetailsPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const StudentDetailsPopup: React.FC<StudentDetailsPopupProps> = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [projectQuery, setProjectQuery] = useState<string>(""); // New search query for projects
    const [selectedFilter, setSelectedFilter] = useState<"All" | "Active" | "Deactive">("All");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isStudentDetailOpen, setIsStudentDetailOpen] = useState(false);
    const [isAddNewStudentOpen, setIsAddNewStudentOpen] = useState(false); // State for AddNewStudentPopup

    const students: Student[] = [
        { id: 1, name: "Chamoth Anuruddha", projects: "T2T Digital Diary", approved: 20, rejected: 10, avatar: "/avatar1.png", location: "Colombo", dob: "01/22/2003", university: "Colombo University", academicYear: "2nd Year", linkedin: "https://linkedin.com", github: "https://github.com", status: "Active", enrolledDate: "01/10/2024", endDate: "04/04/2025" },
        { id: 2, name: "John Doe", projects: "Task Management System", approved: 15, rejected: 5, avatar: "/avatar2.png", location: "Colombo", dob: "05/14/2000", university: "Colombo University", academicYear: "3rd Year", linkedin: "https://linkedin.com", github: "https://github.com", status: "Deactivate", enrolledDate: "02/01/2024", endDate: "05/01/2025" },
        { id: 3, name: "Yasindu Edirisnha", projects: "T2T Digital Diary", approved: 20, rejected: 10, avatar: "/avatar3.png", location: "Colombo", dob: "01/22/2003", university: "Colombo University", academicYear: "2nd Year", linkedin: "https://linkedin.com", github: "https://github.com", status: "Active", enrolledDate: "01/10/2024", endDate: "04/04/2025" },
        { id: 4, name: "Lakshitha Sadaruwan", projects: "T2T Digital Diary", approved: 20, rejected: 10, avatar: "/avatar3.png", location: "Colombo", dob: "01/22/2003", university: "Colombo University", academicYear: "2nd Year", linkedin: "https://linkedin.com", github: "https://github.com", status: "Active", enrolledDate: "01/10/2024", endDate: "04/04/2025" },
        { id: 5, name: "Saros", projects: "T2T Digital Diary", approved: 20, rejected: 10, avatar: "/avatar3.png", location: "Colombo", dob: "01/22/2003", university: "Colombo University", academicYear: "2nd Year", linkedin: "https://linkedin.com", github: "https://github.com", status: "Active", enrolledDate: "01/10/2024", endDate: "04/04/2025" },
        { id: 6, name: "Saiaf", projects: "T2T Digital Diary", approved: 20, rejected: 10, avatar: "/avatar3.png", location: "Colombo", dob: "01/22/2003", university: "Colombo University", academicYear: "2nd Year", linkedin: "https://linkedin.com", github: "https://github.com", status: "Active", enrolledDate: "01/10/2024", endDate: "04/04/2025" },
    ];

    const filteredStudents = useMemo(() => {
        return students.filter((student) =>
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            student.projects.toLowerCase().includes(projectQuery.toLowerCase()) && // Added project search condition
            (selectedFilter === "All" || selectedFilter === "Active" || selectedFilter === "Deactive")
        );
    }, [students, searchQuery, projectQuery, selectedFilter]);

    const handleViewMore = (student: Student) => {
        setSelectedStudent(student);
        setIsStudentDetailOpen(true);
    };

    return (
        <>
            <AlertDialog open={isOpen} onOpenChange={onClose}>
                <AlertDialogContent className="max-w-4xl w-full h-[620px] p-4 sm:p-6">
                    {/* Header Section */}
                    <AlertDialogHeader className="relative">
                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                            <AlertDialogTitle className="text-2xl font-bold">👨 Student Overview</AlertDialogTitle>
                            <button className="px-4 py-2 text-sm bg-pink-700 hover:bg-pink-600 text-white hover:text-white right-12 absolute mt-0 rounded-lg"
                            onClick={() => setIsAddNewStudentOpen(true)}
                            >
                                ➕ Add New Student
                            </button>

                            <button
                                onClick={onClose}
                                className="absolute top-0 right-0 mt-0 mr-4 text-gray-500 text-lg"
                                aria-label="Close dialog"
                            >
                                ✖
                            </button>
                        </div>
                    </AlertDialogHeader>

                    {/* Search and Filter Section */}
                    <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                        {/* Search Bar for Students */}
                        <div className="flex-grow sm:w-[200px]">
                            <Input
                                placeholder="Search students..."
                                className="px-3 py-2 border rounded-md w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Search Bar for Projects */}
                        <div className="flex-grow sm:w-[200px] mt-3 sm:mt-0">
                            <Input
                                placeholder="Search projects..."
                                className="px-3 py-2 border rounded-md w-full"
                                value={projectQuery}
                                onChange={(e) => setProjectQuery(e.target.value)}
                            />
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex gap-2 flex-wrap sm:flex-nowrap sm:ml-4 mt-3 sm:mt-0">
                            {["All", "Active", "Deactive"].map((filter) => (
                                <Button
                                    key={filter}
                                    variant={selectedFilter === filter ? "default" : "outline"}
                                    onClick={() => setSelectedFilter(filter as "All" | "Active" | "Deactive")}
                                    className={`px-4 py-2 text-sm ${
                                        filter === "Active" && selectedFilter === filter
                                            ? "bg-green-700 hover:bg-green-600 text-white"
                                            : filter === "Deactive" && selectedFilter === filter
                                            ? "bg-red-700 hover:bg-red-600 text-white"
                                            : filter === "All" && selectedFilter === filter
                                            ? "bg-blue-700 hover:bg-blue-600 text-white"
                                            : "bg-transparent"
                                    }`}
                                >
                                    {filter}
                                </Button>
                            ))}
                            {/* Filter Icon */}
                            <button className="bg-gray-300 px-4 py-2 rounded-md flex items-center gap-2">
                                <Filter className="w-5 h-5" />
                                Filter
                            </button>
                        </div>
                    </div>

                    {/* Student List Section */}
                    <div className="overflow-y-auto h-[400px] pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b">
                                    <th className="py-2">Name</th>
                                    <th className="py-2">Projects</th>
                                    <th className="py-2">Approved</th>
                                    <th className="py-2">Rejected</th>
                                    <th className="py-2">Status</th>
                                    <th className="py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => (
                                        <tr key={student.id} className="border-b">
                                            <td className="py-3">
                                                <div className="flex items-center space-x-3">
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarImage src={student.avatar} alt={student.name} />
                                                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{student.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3">{student.projects}</td>
                                            <td className="py-3">{student.approved}</td>
                                            <td className="py-3">{student.rejected}</td>
                                            <td className={student.status === "Active" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{student.status}</td>
                                            <td className="py-3">
                                                <Button
                                                    onClick={() => handleViewMore(student)}
                                                    variant="outline"
                                                    className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-600 text-black hover:text-white"
                                                >
                                                    View More
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4 text-gray-500">
                                            No students found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            {/* Show StudentPersonalDetails if a student is selected */}
            {selectedStudent && (
                <StudentPersonalDetails
                    isOpen={isStudentDetailOpen}
                    onClose={() => setIsStudentDetailOpen(false)}
                    student={selectedStudent}
                />
            )}
             {isAddNewStudentOpen && (
                <AddNewStudentPopup isOpen={isAddNewStudentOpen} onClose={() => setIsAddNewStudentOpen(false)} />
            )}
        </>
    );
};

export default StudentDetailsPopup;
