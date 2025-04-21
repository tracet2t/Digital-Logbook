import React from 'react';

const PersonalJournal = () => {
  // Dummy journal entries (replace with backend data later)
  const journalEntries = [
    { color: "red", text: "Started working on a new project." },
    { color: "blue", text: "Had a productive meeting with the team." },
    { color: "green", text: "Completed the UI design for the dashboard." },
    { color: "yellow", text: "Reviewed code changes from the team." },
    { color: "pink", text: "Tested new API integration successfully." }
    
  ];

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">📁 Personal Journal</h2>
        <button className="text-blue-500 text-xl font-semibold text-lg transition-transform transform hover:scale-105 hover:text-red-500 hover:bg-green-200 hover:shadow-lg hover:-translate-y-1">+</button>
      </div>
      <ul className="mt-5 space-y-2">
        {journalEntries.map((entry, index) => (
          <li key={index} className="flex items-center gap-2 ">
            <span className={` mt-5 w-3 h-3 bg-${entry.color}-500`}></span>
            <p className="text-md  mt-5">{entry.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonalJournal;
