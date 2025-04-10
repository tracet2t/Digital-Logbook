import React, { useState } from 'react';

interface Student {
  id: number;
  name: string;
  role: string;
}

interface NewProjectPopupProps {
  closePopup: () => void;
}

const NewProjectPopup: React.FC<NewProjectPopupProps> = ({ closePopup }) => {
  const [projectName, setProjectName] = useState<string>('');
  const [teamId, setTeamId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  
  const sampleStudents = [
    { id: 1, name: 'Nimal Perera' },
    { id: 2, name: 'Piyal Alwis' },
    { id: 3, name: 'Suneera Gamage' },
    { id: 4, name: 'Ryan Perera' },
  ];

  const handleAddStudent = () => {
    if (selectedStudent && selectedRole) {
      const studentExists = students.some(student => student.name === selectedStudent);
      if (!studentExists) {
        setStudents([...students, { id: students.length + 1, name: selectedStudent, role: selectedRole }]);
        setSelectedStudent('');
        setSelectedRole('');
      }
    }
  };

  const handleRemoveStudent = (id: number) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const handleCreate = () => {
    console.log('New project created:', { projectName, teamId, startDate, endDate, students });
    closePopup();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg z-50">
        <h2 className="text-xl font-semibold mb-4">📋 Create New Project</h2>

        {/* Project Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Project Name</label>
          <input type="text" className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
        </div>

        {/* Team ID */}
        <div className="mb-4">
          <label className="block text-sm font-semibold">Team ID</label>
          <input type="text" className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md" value={teamId} onChange={(e) => setTeamId(e.target.value)} />
        </div>

        {/* Start Date and End Date */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold">Start Date</label>
            <input type="date" className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold">End Date</label>
            <input type="date" className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        {/* Add Student */}
        <label className="block text-sm font-semibold mb-4">Select Student</label>
        <div className="flex gap-2 mb-4">
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md" value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
            <option value="">Select Student</option>
            {sampleStudents.map((student) => (
              <option key={student.id} value={student.name}>{student.name}</option>
            ))}
          </select>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
            <option value="">Select Role</option>
            <option value="Team Leader">Team Leader</option>
            <option value="Member">Member</option>
          </select>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleAddStudent}>Add</button>
        </div>

        {/* Students Table */}
<div className="mb-4">
  <table className="w-full border-collapse">
    <thead>
      <tr className="bg-gray-100">
        <th className="py-2 px-4 text-left">Name</th>
        <th className="py-2 px-4 text-left">Role</th>
        <th className="py-2 px-4 text-left">Action</th>
      </tr>
    </thead>
  </table>
  <div className="max-h-32 overflow-y-auto">
    <table className="w-full border-collapse">
      <tbody>
        {students.map((student) => (
          <tr key={student.id} className="border-b">
            <td className="py-2 px-2">{student.name}</td>
            <td className="py-2 px-4">{student.role}</td>
            <td className="py-2 px-6">
              <button className="bg-pink-900 text-white rounded-full p-1 hover:bg-red-800" onClick={() => handleRemoveStudent(student.id)}>❌</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


        {/* Buttons */}
        <div className="flex justify-end mt-4">
          <button className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2" onClick={closePopup}>Cancel</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={handleCreate}>Create</button>
        </div>
      </div>
    </div>
  );
};

export default NewProjectPopup;
