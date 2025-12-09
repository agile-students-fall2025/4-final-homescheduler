import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventModal } from './EventMod';
import './FamilySchedule.css';
import { NavMenu } from "./NavMenu";
import { Link } from "react-router-dom";

const API_URL = 'http://localhost:3001/api/calendar';

export function FamilySchedule() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'add',
    eventData: null,
  });

  // 1) Fetch logged-in user from backend (source of truth)
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://localhost:3001/api/auth/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUser(data);
    };

    fetchUser();
  }, []);

  // 2) Once user (and their family) is known, fetch family events
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user || !user.family) return;

      try {
        const response = await fetch(
          `${API_URL}/events?isFamily=true&family=${encodeURIComponent(
            user.family
          )}`
        );
        if (!response.ok) throw new Error("Network response not ok");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [user]);

  // 3) While user is loading, avoid rendering the calendar
  if (!user) {
    return <div>Loading user...</div>;
  }

  const CURRENT_USER = user.name;
  const CURRENT_FAM = user.family;

  // 4) Filter for family events (defensive)
  const familyEvents = events.filter(
    (e) => e.extendedProps?.isFamily === true || e.isFamily === true
  );

  // --- Event Handlers ---

  const handleSelect = (selectInfo) => {
    setModalState({ isOpen: true, mode: 'add', eventData: selectInfo });
  };

  const handleEventClick = (clickInfo) => {
    setModalState({ isOpen: true, mode: 'edit', eventData: clickInfo.event });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: 'add', eventData: null });
  };

  // --- C.R.U.D. Operations ---

  const handleSave = async (formData) => {
    if (modalState.mode === 'add') {
      const dateStr = modalState.eventData.startStr;
      const startDateTime = new Date(`${dateStr}T${formData.time}`).toISOString();

      const newEventData = {
        title: formData.title,
        start: startDateTime,
        location: formData.location,
        user: CURRENT_USER,
        isFamily: true,
        family: CURRENT_FAM,
      };

      try {
        const response = await fetch(`${API_URL}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEventData),
        });
        if (!response.ok) throw new Error('Error creating event');

        const createdEvent = await response.json();
        setEvents((prev) => [...prev, createdEvent]);
      } catch (error) {
        console.error('Error creating event:', error);
      }
    } else if (modalState.mode === 'edit') {
      const originalEvent = modalState.eventData;
      const dateOnly = originalEvent.startStr.split('T')[0];
      const startDateTime = new Date(`${dateOnly}T${formData.time}`).toISOString();

      const updatedEventPayload = {
        title: formData.title,
        start: startDateTime,
        extendedProps: {
          location: formData.location,
          user: originalEvent.extendedProps?.user || CURRENT_USER,
          isFamily: true,
          family: CURRENT_FAM,
        },
      };

      try {
        const response = await fetch(`${API_URL}/events/${originalEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedEventPayload),
        });
        if (!response.ok) throw new Error('Error updating event');

        const savedEvent = await response.json();
        setEvents((prev) =>
          prev.map((e) => (e.id === savedEvent.id ? savedEvent : e))
        );
      } catch (error) {
        console.error('Error updating event:', error);
      }
    }

    closeModal();
  };

  const handleDelete = async () => {
    const eventId = modalState.eventData.id;
    try {
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error deleting event');

      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
    closeModal();
  };

  const handleEventChange = async (changeInfo) => {
    const event = changeInfo.event;

    const updatedEvent = {
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      allDay: event.allDay,
      extendedProps: {
        location: event.extendedProps.location,
        user: event.extendedProps.user,
        isFamily: event.extendedProps.isFamily,
        family: CURRENT_FAM,
      },
    };

    try {
      const response = await fetch(`${API_URL}/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) throw new Error('Error updating event drag/drop');

      const savedEvent = await response.json();
      setEvents((prev) =>
        prev.map((e) => (e.id === savedEvent.id ? savedEvent : e))
      );
    } catch (error) {
      console.error('Error updating event (drag/drop):', error);
      changeInfo.revert();
    }
  };

  return (
    <div className="calendar-wrapper">
      <h2 id="familySchedule">Family Calendar</h2>
      <p id="instruction">Select a date to add / edit an event.</p>
      <NavMenu />

      <div className="calendar-toggle">
        <Link to="/myschedule">
          <button className="my-cal">My Calendar</button>
        </Link>
        <Link to="/familyschedule">
          <button className="fam-cal">Family Calendar</button>
        </Link>
        <Link to="/combinedschedule">
          <button className="com-cal">Combined Calendar</button>
        </Link>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={familyEvents}
        selectable={true}
        editable={true}
        select={handleSelect}
        eventClick={handleEventClick}
        eventChange={handleEventChange}
      />

      {modalState.isOpen && (
        <EventModal
          event={modalState.mode === 'edit' ? modalState.eventData : null}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
