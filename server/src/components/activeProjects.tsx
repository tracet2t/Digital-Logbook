// components/ActiveProjects.tsx
import React from 'react';
import { Filter } from 'lucide-react';

const ActiveProjects = () => {
  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Active Projects</h2>
        <div className="flex gap-2">
          <button className="bg-gray-300 px-4 py-2 rounded-md flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter
          </button>
          <button className="bg-pink-700 text-white px-4 py-2 rounded-md">+ New Project</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {["Mobile Application Development", "Digital Diary", "Forms Management", "T2T Platform"].map((project, index) => {
          const projectData = [
            { total: 18, pending: 4, approved: 12, rejected: 2 },
            { total: 22, pending: 3, approved: 16, rejected: 3 },
            { total: 15, pending: 5, approved: 8, rejected: 2 },
            { total: 20, pending: 2, approved: 15, rejected: 3 },
          ];

          const { total, pending, approved, rejected } = projectData[index];

          return (
            <div key={index} className="bg-gray-200 p-4 rounded-md shadow-md relative">

              <button className="absolute top-2 right-2 bg-green-500 text-white px-4 py-2 text-sm font-semibold rounded-md pointer-events-none">
                Active
              </button>
              <h3 className="text-lg font-semibold">{project}</h3>
              <p className="text-sm text-gray-500">Team {String.fromCharCode(65 + index)}</p>
              <div className="flex justify-between mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{total}</p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{pending}</p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{approved}</p>
                  <p className="text-sm text-gray-500">Approved</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{rejected}</p>
                  <p className="text-sm text-gray-500">Rejected</p>
                </div>
              </div>
              <button className="mt-3 bg-blue-200 px-4 py-2 rounded-md w-full hover:bg-blue-500 hover:shadow-lg hover:text-white">
                View Detail
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveProjects;
