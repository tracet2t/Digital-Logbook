'use client';

import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views, Event as BigCalendarEvent } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal } from 'antd';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

const events: CalendarEvent[] = [
  {
    id: 0,
    title: 'Board meeting',
    start: new Date(2024, 7, 29, 9, 0, 0), // August 29, 2024, 9:00 AM
    end: new Date(2024, 7, 29, 13, 0, 0), // August 29, 2024, 1:00 PM
  },
  {
    id: 1,
    title: 'MS training',
    allDay: true,
    start: new Date(2024, 7, 29, 14, 0, 0), // August 29, 2024, 2:00 PM
    end: new Date(2024, 7, 29, 16, 30, 0), // August 29, 2024, 4:30 PM
  },
  {
    id: 2,
    title: 'Team lead meeting',
    start: new Date(2024, 7, 29, 8, 30, 0), // August 29, 2024, 8:30 AM
    end: new Date(2024, 7, 29, 12, 30, 0), // August 29, 2024, 12:30 PM
  },
  {
    id: 11,
    title: 'Birthday Party',
    start: new Date(2024, 7, 30, 7, 0, 0), // August 30, 2024, 7:00 AM
    end: new Date(2024, 7, 30, 10, 30, 0), // August 30, 2024, 10:30 AM
  }
];

const styles = {
  container: {
    width: '80vw',
    height: '60vh',
    margin: '2em'
  }
};

const TaskCalendar: React.FC = () => {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskDetail, setTaskDetail] = useState<{ selectedDate: string }>({ selectedDate: 'No Date Selected' });

  const handleSelectEvent = (event: BigCalendarEvent) => {
    const calendarEvent = event as CalendarEvent; // Type assertion
    setTaskDetail({ selectedDate: calendarEvent.title });
    setTaskModalOpen(true);
  };

  const handleOk = () => {
    setTaskModalOpen(false);
  };

  const handleCancel = () => {
    setTaskModalOpen(false);
  };

  return (
    <>
      <Modal
        title="Task Detail"
        open={taskModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>{taskDetail.selectedDate}</div>
      </Modal>
      <div style={styles.container}>
        <BigCalendar
          selectable
          localizer={localizer}
          events={events}
          defaultView={Views.WEEK}
          views={[Views.DAY, Views.WEEK, Views.MONTH]}
          step={60}
          defaultDate={new Date(2024, 7, 29)} // Default to August 29, 2024
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
        />
      </div>
    </>
  );
};

export default TaskCalendar;
