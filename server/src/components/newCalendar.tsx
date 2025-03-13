import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Move to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Move to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Generate calendar grid
  const generateDays = (): (number | null)[] => {
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const firstDayIndex = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();

    const emptyDays: (number | null)[] = Array.from({ length: firstDayIndex }, () => null);
    const days: (number | null)[] = Array.from({ length: totalDays }, (_, i) => i + 1);

    return [...emptyDays, ...days];
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md w-full max-w-md mx-auto">
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
                ${isToday ? "bg-pink-500 text-white font-bold" : ""}`}
            >
              {day || ""}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;