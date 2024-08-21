'use client'

import type { BadgeProps, CalendarProps } from 'antd';
import { Badge, Calendar, Modal } from 'antd';
import { SelectInfo } from 'antd/es/calendar/generateCalendar';
import type { Dayjs } from 'dayjs';
import { useState } from 'react';

const getListData = (value: Dayjs) => {
    let listData: { type: string; content: string }[] = []; // Specify the type of listData
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

    const showModal = (date: Dayjs, selectInfo: SelectInfo) => {
        console.log(selectInfo);
        
        if (selectInfo.source === 'date') {
            setTaskDetail({ selectedDate: date.toDate().toDateString() });
            setTaskModalOpen(true);
        }
    };
    
    const handleOk = () => {
        setTaskModalOpen(false);
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
        <Modal title="Task Detail" open={taskModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <div>{(taskDetail as any).selectedDate}</div>
        </Modal>
        <Calendar onSelect={showModal} cellRender={cellRender} />
    </>;
}