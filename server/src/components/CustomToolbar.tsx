// src/components/CustomToolbar.tsx
import React from 'react';
import moment from 'moment';
import { Button } from './ui/button';

interface CustomToolbarProps {
  toolbar: any;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({ toolbar, currentDate, setCurrentDate }) => {
  const goToBack = () => {
    toolbar.onNavigate("PREV");
  };

  const goToNext = () => {
    toolbar.onNavigate("NEXT");
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <Button
        onClick={() => { setCurrentDate(moment(currentDate).subtract(1, "months").toDate()); goToBack(); }}
        className="text-xl border-2 border-blue-500 text-blue-500 px-4 py-2 bg-white rounded-md hover:border-blue-600 hover:bg-blue-100"
      >
        {"<"}
      </Button>
      <span className="text-2xl font-bold">{moment(toolbar.date).format("MMMM YYYY")}</span>
      <Button
        onClick={() => { setCurrentDate(moment(currentDate).add(1, "months").toDate()); goToNext(); }}
        className="text-xl border-2 border-blue-500 text-blue-500 px-4 py-2 bg-#F0F8FF rounded-md hover:border-blue-600 hover:bg-blue-100"
      >
        {">"}
      </Button>
    </div>
  );
};

export default CustomToolbar;
