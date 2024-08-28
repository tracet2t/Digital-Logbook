'use client';

import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views, Event as BigCalendarEvent } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Input, Button, Form } from 'antd';

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
    start: new Date(2024, 7, 29, 9, 0, 0),
    end: new Date(2024, 7, 29, 13, 0, 0),
  },
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
  const [formData, setFormData] = useState<{ date: string; hours: string; notes: string }>({
    date: '',
    hours: '',
    notes: ''
  });

  const handleSelectEvent = (event: BigCalendarEvent) => {
    const calendarEvent = event as CalendarEvent;
    setTaskDetail({ selectedDate: calendarEvent.title });
    setFormData({
      date: calendarEvent.start.toISOString().split('T')[0],
      hours: '',
      notes: ''
    });
    setTaskModalOpen(true);
  };

  const handleClose = () => {
    setTaskModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    const response = await fetch('/api/activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: formData.date,
        timeSpent: parseFloat(formData.hours),
        notes: formData.notes,
        studentId: 'some-student-id'  // Replace with actual student ID
      }),
    });

    if (response.ok) {
      alert('Activity created successfully!');
      setTaskModalOpen(false);
    } else {
      alert('Failed to create activity');
    }
  };

  return (
    <>
      <Modal
        title="Task Detail"
        visible={taskModalOpen}
        onCancel={handleClose}
        footer={[
          <Button key="cancel" onClick={handleClose}>
            Close
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            OK
          </Button>
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Date">
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item label="Working Hours">
            <Input
              type="text"
              name="hours"
              value={formData.hours}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item label="Notes">
            <Input.TextArea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </Form.Item>
        </Form>
      </Modal>
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
