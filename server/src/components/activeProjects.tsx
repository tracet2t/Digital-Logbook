import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import UpdateProjectPopup from './UpdateProjectPopup';
import NewProjectPopup from './NewProjectPopup';
import ProjectDetailsPopUp from './projectDetailsPopUp'; // Import the ProjectDetailsPopUp component

const ActiveProjects: React.FC = () => {
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [isNewProjectPopupVisible, setIsNewProjectPopupVisible] = useState<boolean>(false);
  const [isProjectDetailsVisible, setIsProjectDetailsVisible] = useState<boolean>(false); // State for ProjectDetailsPopUp
  const [currentProject, setCurrentProject] = useState<string>('');

  // Open Update Project Popup
  const handleEditClick = (projectName: string) => {
    setCurrentProject(projectName);
    setIsPopupVisible(true);
  };

  // Open New Project Popup
  const handleNewProjectClick = () => {
    setIsNewProjectPopupVisible(true);
  };

  // Open Project Details Popup
  const handleViewDetailClick = (projectName: string) => {
    setCurrentProject(projectName);
    setIsProjectDetailsVisible(true);
  };

  // Close Popups
  const closePopup = () => {
    setIsPopupVisible(false);
    setCurrentProject('');
  };

  const closeNewProjectPopup = () => {
    setIsNewProjectPopupVisible(false);
  };

  const closeProjectDetailsPopup = () => {
    setIsProjectDetailsVisible(false);
    setCurrentProject('');
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Active Projects</h2>
        <div className="flex gap-2">
          <button className="bg-gray-300 px-4 py-2 rounded-md flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter
          </button>
          <button
            className="bg-pink-700 text-white px-4 py-2 rounded-md"
            onClick={handleNewProjectClick}
          >
            + New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {["Mobile App", "Digital Diary", "Forms Management", "T2T Platform"].map(
          (project, index) => {
            const projectData = [
              { total: 18, pending: 4, approved: 12, rejected: 2 },
              { total: 22, pending: 3, approved: 16, rejected: 3 },
              { total: 15, pending: 5, approved: 8, rejected: 2 },
              { total: 20, pending: 2, approved: 15, rejected: 3 },
            ];

            const { total, pending, approved, rejected } = projectData[index];

            return (
              <div key={index} className="bg-gray-200 p-4 rounded-md shadow-md relative">
                <button className="absolute top-2 right-14 bg-green-600 text-white px-3 py-2 text-sm font-semibold rounded-md pointer-events-none">
                  Active
                </button>
                <button
                  className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-2 text-sm font-semibold rounded-md"
                  onClick={() => handleEditClick(project)}
                >
                  ✎
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
                <button
                  className="mt-3 bg-blue-200 px-4 py-2 rounded-md w-full hover:bg-blue-500 hover:shadow-lg hover:text-white"
                  onClick={() => handleViewDetailClick(project)} // Open Project Details Popup
                >
                 <span>View Detail</span>
                </button>
              </div>
            );
          }
        )}
      </div>

      {/* Conditionally render the update project popup */}
      {isPopupVisible && <UpdateProjectPopup closePopup={closePopup} projectName={currentProject} />}

      {/* Conditionally render the new project popup */}
      {isNewProjectPopupVisible && <NewProjectPopup closePopup={closeNewProjectPopup} />}

      {/* Conditionally render the project details popup */}
      {isProjectDetailsVisible && <ProjectDetailsPopUp isOpen={isProjectDetailsVisible} onClose={closeProjectDetailsPopup} />}
    </div>
  );
};

export default ActiveProjects;
