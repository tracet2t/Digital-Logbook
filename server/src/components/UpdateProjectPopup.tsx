import React, { useState } from 'react';

interface Student {
  id: number;
  name: string;
  role: string;
}

interface UpdateProjectPopupProps {
  closePopup: () => void;
  projectName: string;
}

const UpdateProjectPopup: React.FC<UpdateProjectPopupProps> = ({ closePopup, projectName }) => {
  const [teamId, setTeamId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Saiaf', role: 'Team Leader' },
    { id: 2, name: 'Chamoth', role: 'Member' },
    { id: 3, name: 'Lakshitha', role: 'Member' },
    { id: 4, name: 'Saros', role: 'Member' },
  ]);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([
    { id: 5, name: 'Nimal Perera', role: '' },
    { id: 6, name: 'Piyal Alwis', role: '' },
    { id: 7, name: 'Suneera Gamage', role: '' },
    { id: 8, name: 'Ryan Perera', role: '' },
  ]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');

  const handleRoleChange = (id: number, newRole: string) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id ? { ...student, role: newRole } : student
      )
    );
  };

  const handleAddStudent = () => {
    const studentToAdd = availableStudents.find((s) => s.name === selectedStudent);
    if (studentToAdd && selectedRole) {
      setStudents([...students, { ...studentToAdd, role: selectedRole }]);
      setAvailableStudents(availableStudents.filter((s) => s.id !== studentToAdd.id));
      setSelectedStudent('');
      setSelectedRole('');
    }
  };

  const handleRemoveStudent = (id: number) => {
    const studentToRemove = students.find((s) => s.id === id);
    if (studentToRemove) {
      setStudents(students.filter((s) => s.id !== id));
      setAvailableStudents([...availableStudents, { ...studentToRemove, role: '' }]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg z-50">
        <h2 className="text-xl font-semibold mb-4">📊 Update {projectName}</h2>

        {/* Project Name */}
        <div className="mb-4">
          <label htmlFor="projectName" className="block text-sm font-semibold">Project Name</label>
          <input
            id="projectName"
            type="text"
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
            value={projectName}
            readOnly
          />
        </div>

        {/* Team ID */}
        <div className="mb-4">
          <label htmlFor="teamId" className="block text-sm font-semibold">Team ID</label>
          <input
            id="teamId"
            type="text"
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
          />
        </div>

        {/* Start Date and End Date */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-semibold">Start Date</label>
            <input
              id="startDate"
              type="date"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-semibold">End Date</label>
            <input
              id="endDate"
              type="date"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

               {/* Students List */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Students List</label>
          <div className="mt-2">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Role</th>
                  <th className="py-2 px-4 text-left">Action</th>
                </tr>
              </thead>
            </table>
            <div className="max-h-32 overflow-y-auto"> {/* Added max height and scroll */}
              <table className="w-full border-collapse">
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b">
                      <td className="py-2 px-2">{student.name}</td>
                      <td className="py-2 px-4">{student.role}</td>
                      <td className="py-2 px-6">
                        <button
                          className="bg-pink-900 text-white rounded-full p-1 hover:bg-red-800 transition-colors"
                          onClick={() => handleRemoveStudent(student.id)}
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>


        {/* Add Student Section */}
        <div className="mb-4 flex gap-4">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">Select Student</option>
            {availableStudents.map((student) => (
              <option key={student.id} value={student.name}>{student.name}</option>
            ))}
          </select>

          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="Team Leader">Team Leader</option>
            <option value="Member">Member</option>
          </select>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleAddStudent}
          >
            Add
          </button>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-4">
          <button className="bg-red-500 text-white px-4 py-2 rounded-md mr-2" onClick={closePopup}>Deactivate</button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2" onClick={closePopup}>Cancel</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={closePopup}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProjectPopup;
