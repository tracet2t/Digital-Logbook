'use client'

import type { BadgeProps, CalendarProps } from 'antd';
import { Badge, Calendar, Modal, Input, Form, Button } from 'antd';
import { SelectInfo } from 'antd/es/calendar/generateCalendar';
import type { Dayjs } from 'dayjs';
import { useState } from 'react';

const getListData = (value: Dayjs) => {
    let listData: { type: string; content: string }[] = [];
    switch (value.date()) {
      case 8:
        listData = [
          { type: 'warning', content: 'This is warning event.' },
          { type: 'success', content: 'This is usual event.' },
        ];
        break;
      case 10:
        listData = [
          { type: 'warning', content: 'This is warning event.' },
          { type: 'success', content: 'This is usual event.' },
          { type: 'error', content: 'This is error event.' },
        ];
        break;
      case 15:
        listData = [
          { type: 'warning', content: 'This is warning event' },
          { type: 'success', content: 'This is very long usual event......' },
          { type: 'error', content: 'This is error event 1.' },
          { type: 'error', content: 'This is error event 2.' },
          { type: 'error', content: 'This is error event 3.' },
          { type: 'error', content: 'This is error event 4.' },
        ];
        break;
      default:
    }
    return listData || [];
  };

const getMonthData = (value: Dayjs) => {
    if (value.month() === 8) {
      return 1394;
    }
};

export default function TaskCalendar() {
    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [taskDetail, setTaskDetail] = useState({selectedDate: "No Date Selected"});
    const [form] = Form.useForm();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const showModal = (date: Dayjs, selectInfo: SelectInfo) => {
        if (selectInfo.source === 'date') {
            setTaskDetail({ selectedDate: date.toDate().toDateString() });
            setTaskModalOpen(true);
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const { studentId, timeSpent, notes } = values;
            const date = taskDetail.selectedDate;

            const response = await fetch('/api/create/create_activity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ studentId, date, timeSpent, notes }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            setSuccess('Activity created successfully!');
            console.log(result);
            form.resetFields();
        } catch (error) {
            setError('Failed to create activity');
            console.error('Error:', error);
        } finally {
            setTaskModalOpen(false);
        }
    };

    const handleCancel = () => {
        setTaskModalOpen(false);
    };

    const monthCellRender = (value: Dayjs) => {
        const num = getMonthData(value);
        return num ? (
          <div className="notes-month">
            <section>{num}</section>
            <span>Backlog number</span>
          </div>
        ) : null;
      };

    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value);
        return (
          <ul className="events">
            {listData.map((item) => (
              <li key={item.content}>
                <Badge status={item.type as BadgeProps['status']} text={item.content} />
              </li>
            ))}
          </ul>
        );
      };

    const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
        if (info.type === 'date') return dateCellRender(current);
        if (info.type === 'month') return monthCellRender(current);
        return info.originNode;
    };

    return <>
        <Modal
            title="Task Detail"
            open={taskModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <div>
                <div>{taskDetail.selectedDate}</div>
                <Form form={form} layout="vertical" name="activityForm" initialValues={{}}>
                    <Form.Item
                        name="studentId"
                        label="Student ID"
                        rules={[{ required: true, message: 'Please input the student ID!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="timeSpent"
                        label="Time Spent"
                        rules={[{ required: true, message: 'Please input the time spent!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="notes"
                        label="Notes"
                        rules={[{ required: true, message: 'Please input the notes!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </Form>
            </div>
        </Modal>
        <Calendar onSelect={showModal} cellRender={cellRender} />
    </>;
}
