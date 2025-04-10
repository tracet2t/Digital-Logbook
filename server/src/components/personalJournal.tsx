import React from 'react';

const PersonalJournal = () => {
  // Dummy journal entries (replace with backend data later)
  const journalEntries = [
    { color: "red", text: "Started working on a new project." },
    { color: "blue", text: "Had a productive meeting with the team." },
    { color: "green", text: "Completed the UI design for the dashboard." },
    { color: "yellow", text: "Reviewed code changes from the team." },
    { color: "red", text: "Started working on a new project." },
    { color: "blue", text: "Had a productive meeting with the team." },
    { color: "pink", text: "Tested new API integration successfully." },
    { color: "red", text: "Refactored authentication logic." },
    { color: "blue", text: "Fixed a bug in the payment gateway." },
    { color: "red", text: "Updated documentation for the API." },
    { color: "green", text: "Started working on a new project." },
    { color: "pink", text: "Implemented a new caching strategy." }
  ];

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">📁 Personal Journal</h2>
        <button className="text-blue-500 text-xl font-semibold transition-transform transform hover:scale-105 hover:text-red-500 hover:bg-green-200 hover:shadow-lg hover:-translate-y-1">
          +
        </button>
      </div>

      {/* Journal List - Most Recent 10 Entries Always Visible */}
      <ul className="mt-5 space-y-2 max-h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {journalEntries.slice(-10).map((entry, index) => ( // Shows only last 7 entries
          <li key={index} className="flex items-center gap-2">
            <span className={`mt-5 w-3 h-3 bg-${entry.color}-500 rounded-full`}></span>
            <p className="mt-5 text-md">{entry.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonalJournal;
