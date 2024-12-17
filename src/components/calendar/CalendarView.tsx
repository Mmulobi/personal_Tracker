import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import EventEditor from './EventEditor';
import { useEvents } from '../../hooks/useEvents';
import type { EventInput } from '@fullcalendar/core';

const CalendarView: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedEvent, setSelectedEvent] = useState<EventInput>();

  const handleDateSelect = (selectInfo: any) => {
    setSelectedDate(selectInfo.start);
    setIsEditing(true);
  };

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event);
    setIsEditing(true);
  };

  const handleSave = (eventData: any) => {
    if (selectedEvent) {
      updateEvent(selectedEvent.id as string, eventData);
    } else {
      addEvent(eventData);
    }
    setIsEditing(false);
    setSelectedEvent(undefined);
    setSelectedDate(undefined);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <CalendarIcon className="w-6 h-6" />
          Calendar
        </h2>
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Event
        </button>
      </div>

      {isEditing ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <EventEditor
            event={selectedEvent}
            initialDate={selectedDate}
            onSave={handleSave}
            onCancel={() => {
              setIsEditing(false);
              setSelectedEvent(undefined);
              setSelectedDate(undefined);
            }}
            onDelete={selectedEvent ? () => {
              deleteEvent(selectedEvent.id as string);
              setIsEditing(false);
              setSelectedEvent(undefined);
            } : undefined}
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={events}
            select={handleDateSelect}
            eventClick={handleEventClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,dayGridDay'
            }}
            height="auto"
          />
        </div>
      )}
    </div>
  );
};

export default CalendarView;