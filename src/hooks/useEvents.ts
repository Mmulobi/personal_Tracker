import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { storage, STORAGE_KEYS } from '../utils/storage';
import type { EventInput } from '@fullcalendar/core';

export const useEvents = () => {
  const [events, setEvents] = useState<EventInput[]>([]);

  useEffect(() => {
    const storedEvents = storage.get<EventInput[]>(STORAGE_KEYS.EVENTS) || [];
    setEvents(storedEvents);
  }, []);

  const addEvent = (eventData: Omit<EventInput, 'id'>) => {
    const newEvent: EventInput = {
      ...eventData,
      id: uuidv4(),
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    storage.set(STORAGE_KEYS.EVENTS, updatedEvents);
  };

  const updateEvent = (id: string, updates: Partial<EventInput>) => {
    const updatedEvents = events.map(event =>
      event.id === id
        ? { ...event, ...updates }
        : event
    );
    setEvents(updatedEvents);
    storage.set(STORAGE_KEYS.EVENTS, updatedEvents);
  };

  const deleteEvent = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    storage.set(STORAGE_KEYS.EVENTS, updatedEvents);
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
  };
};