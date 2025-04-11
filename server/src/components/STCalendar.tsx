import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const generateDays = () => {
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const firstDayIndex = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();

    const emptyDays = Array.from({ length: firstDayIndex }, () => null);
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);

    return [...emptyDays, ...days];
  };

  return (
    <div className="flex bg-gray-100 rounded-lg shadow-lg overflow-hidden max-w-lg mx-auto">
      {/* Left Sidebar */}
      <div className="bg-gray-700 text-white p-6 flex flex-col items-center justify-center w-1/3">
        <div className="text-3xl font-bold">{today.getFullYear()}</div>
        <div className="text-xl font-semibold mt-2">{today.toLocaleString("default", { month: "long" }).toUpperCase()}</div>
        <div className="text-5xl font-bold mt-2">{today.getDate()}</div>
        <div className="text-lg font-medium mt-2">{daysOfWeek[today.getDay()]}</div>
      </div>

      {/* Calendar */}
      <div className="bg-white p-4 w-2/3">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <button onClick={prevMonth}>
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold">
            {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
          </h2>
          <button onClick={nextMonth}>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Days of the week */}
        <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-600 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="py-1">{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {generateDays().map((day, index) => {
            const isToday =
              day === today.getDate() &&
              currentDate.getMonth() === today.getMonth() &&
              currentDate.getFullYear() === today.getFullYear();

            return (
              <div
                key={index}
                className={`h-10 flex items-center justify-center rounded-md text-sm cursor-pointer transition duration-200 
                  ${day ? "bg-gray-100 hover:bg-blue-500 hover:text-white" : ""} 
                  ${isToday ? "bg-purple-500 text-white font-bold" : ""}`}
              >
                {day || ""}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;