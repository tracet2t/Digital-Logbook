import React from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

interface StudentPersonalDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    student: Student | null; // Allow student to be null
}

const StudentPersonalDetails: React.FC<StudentPersonalDetailsProps> = ({ isOpen, onClose, student }) => {
    if (!student) return null; // Avoid rendering if student is null

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-3xl w-full p-6 bg-white rounded-lg shadow-lg">
                {/* Header */}
                <AlertDialogHeader className="relative flex justify-between">
                    <AlertDialogTitle className="text-3xl font-semibold text-gray-900">👤 Student Details</AlertDialogTitle>
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
                        aria-label="Close dialog"
                    >
                        ✖
                    </button>
                </AlertDialogHeader>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Personal Details */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Details</h3>
                        <div className="flex items-center space-x-4">
                            <Avatar className="w-24 h-24">
                                <AvatarImage src={student.avatar} alt={student.name} />
                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <p className="text-lg font-medium text-gray-900">{student.name}</p>
                                <p className="text-sm text-gray-600"><strong>Location:</strong> {student.location}</p>
                                <p className="text-sm text-gray-600"><strong>DOB:</strong> {student.dob}</p>
                                <p className="text-sm text-gray-600"><strong>University:</strong> {student.university}</p>
                                <p className="text-sm text-gray-600"><strong>Academic Year:</strong> {student.academicYear}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">
                                <strong>🔗 Linkedin:</strong>{" "}
                                <a href={student.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {student.linkedin}
                                </a>
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>🐙 Github:</strong>{" "}
                                <a href={student.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {student.github}
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Project Details */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Project Details</h3>
                        <p className="text-sm text-gray-600"><strong>Projects:</strong> {student.projects}</p>
                        <p className="text-sm text-gray-600">
                            <strong>Status:</strong>{" "}
                            <span className={student.status === "Active" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                {student.status}
                            </span>
                        </p>
                        <p className="text-sm text-green-600"><strong>Approved:</strong> {student.approved}</p>
                        <p className="text-sm text-red-600"><strong>Rejected:</strong> {student.rejected}</p>
                        <p className="text-sm text-gray-600"><strong>Enrolled Date:</strong> {student.enrolledDate}</p>
                        <p className="text-sm text-gray-600"><strong>End Date:</strong> {student.endDate}</p>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mt-6">
                            <Button className="bg-gray-300 text-gray-600 cursor-not-allowed" disabled>
                                Activate
                            </Button>
                            <Button className="bg-red-600 hover:bg-red-500 text-white">Deactivate</Button>
                        </div>
                    </div>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default StudentPersonalDetails;
