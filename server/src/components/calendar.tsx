'use client';

import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views, Event as BigCalendarEvent } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button } from "@/components/ui/button";
import OverallFeedback from './feedback/overallfeeback';  // Import the OverallFeedback component
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

const events: CalendarEvent[] = [
  {
    id: '1',
    title: 'Board meeting',
    start: new Date(2024, 7, 29, 9, 0, 0),
    end: new Date(2024, 7, 29, 13, 0, 0),  
  },
  {
    id: '2',
    title: 'MS training',
    allDay: true,
    start: new Date(2024, 7, 29, 14, 0, 0),
    end: new Date(2024, 7, 29, 16, 30, 0),
  },
];

const styles = {
  container: {
    width: '80vw',
    height: '60vh',
    margin: '2em'
  },
  header: {
    margin: '1em 0',
    textAlign: 'center'
  }
};

const TaskCalendar: React.FC = () => {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [overallFeedbackOpen, setOverallFeedbackOpen] = useState(false);
  const [taskDetail, setTaskDetail] = useState<{ id: string; title: string; }>({ id: '', title: '' });
  const [currentStudentId, setCurrentStudentId] = useState<number | null>(null);

  const handleSelectEvent = (event: BigCalendarEvent) => {
    const calendarEvent = event as CalendarEvent;
    setTaskDetail({ id: calendarEvent.id, title: calendarEvent.title, });
    setTaskModalOpen(true);
  };

  const handleSaveOverallFeedback = (feedback: string) => {
    setOverallFeedbackOpen(false);
  };

  const handleOverallFeedbackButtonClick = () => {
    setOverallFeedbackOpen(true);
  };

  return (
    <>
      <div>
          <Button onClick={handleOverallFeedbackButtonClick}>
            Add Overall Feedback
          </Button>
      </div>

      {taskModalOpen && (
        <AlertDialog open={taskModalOpen} onOpenChange={setTaskModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Task Detail</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              <div>{taskDetail.title}</div>
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setTaskModalOpen(false)}>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {overallFeedbackOpen && (
        <OverallFeedback
          onClose={() => setOverallFeedbackOpen(false)}
          onSave={handleSaveOverallFeedback}
        />
      )}

      <div style={styles.container}>
        <BigCalendar
          selectable
          localizer={localizer}
          events={events}
          defaultView={Views.WEEK}
          views={[Views.DAY, Views.WEEK, Views.MONTH]}
          step={60}
          defaultDate={new Date(2024, 7, 29)}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
        />
      </div>
    </>
  );
};

export default TaskCalendar;
