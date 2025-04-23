"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AddNewStudentPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddNewStudentPopup: React.FC<AddNewStudentPopupProps> = ({ isOpen, onClose }) => {
    const [newStudent, setNewStudent] = useState({
        name: "",
        email: "",
        projects: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewStudent((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewStudent((prevState) => ({
            ...prevState,
            projects: e.target.value,
        }));
    };

    const handleAddStudent = () => {
        // Logic to add the student to the list
        console.log("New student added:", newStudent);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800">👤 Add New Student</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <Input
                            name="name"
                            placeholder="Enter student's name"
                            value={newStudent.name}
                            onChange={handleInputChange}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <Input
                            name="email"
                            placeholder="Enter student's email"
                            value={newStudent.email}
                            onChange={handleInputChange}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Project Name</label>
                        <select
                            name="projects"
                            value={newStudent.projects}
                            onChange={handleSelectChange}
                            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select a project</option>
                            <option value="Project A">Project A</option>
                            <option value="Project B">Project B</option>
                            <option value="Project C">Project C</option>
                            <option value="Project D">Project D</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button onClick={handleAddStudent} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg">
                        Add Student
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddNewStudentPopup;
