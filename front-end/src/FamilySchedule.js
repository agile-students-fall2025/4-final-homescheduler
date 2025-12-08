import React, { useState, useEffect, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventModal } from './EventMod';
import './FamilySchedule.css';
import { NavMenu } from "./NavMenu";
import { Link } from "react-router-dom";

const API_URL = 'http://localhost:3001/api/calendar';

console.log("--- FamilySchedule component file was loaded ---");

export function FamilySchedule() {
  console.log("--- FamilySchedule component IS RENDERING ---")

  // Access user data 
  const userData = JSON.parse(localStorage.getItem("user"));
  const CURRENT_USER = userData?.name || "Guest"; // Fallback if no user

  const [events, setEvents] = useState([]);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'add', 
    eventData: null, 
  });

  // Filter for Family Events
  //new
  
  const familyEvents = events.filter(
     (e) => e.extendedProps?.isFamily === true || e.isFamily === true
   );

  // --- Data Fetching ---
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // UPDATED: Pass the user in the query string
      const response = await fetch(`${API_URL}/events?user=${CURRENT_USER}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      // MongoDB returns _id, but our backend helper maps it to id.
      // FullCalendar needs 'start' and 'end' as ISO strings, which Mongo provides.
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

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
      // --- CREATE ---
      const dateStr = modalState.eventData.startStr; // e.g. "2023-11-28"
      // Combine date and time for MongoDB
      const startDateTime = new Date(`${dateStr}T${formData.time}`).toISOString();

      const newEventData = {
        title: formData.title,
        start: startDateTime,
        location: formData.location, // Matches our new Schema
        user: CURRENT_USER,
        isFamily: true,
      };

      try {
        const response = await fetch(`${API_URL}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEventData),
        });
        if (!response.ok) throw new Error('Error creating event');
        
        const createdEvent = await response.json();
        setEvents([...events, createdEvent]);
      } catch (error) {
        console.error('Error creating event:', error);
      }
    } else if (modalState.mode === 'edit') {
      // --- UPDATE ---
      const originalEvent = modalState.eventData;
      
      // Re-construct start time based on new form data
      const dateOnly = originalEvent.startStr.split('T')[0]; // Extract YYYY-MM-DD
      const startDateTime = new Date(`${dateOnly}T${formData.time}`).toISOString();

      // We only send what changed to keep it clean, but FullCalendar logic usually requires
      // sending the structure it expects back.
      const updatedEventPayload = {
        title: formData.title,
        start: startDateTime,
        // We pass extendedProps so the backend can extract 'location'
        extendedProps: {
          location: formData.location,
          user: originalEvent.extendedProps?.user || CURRENT_USER,
          isFamily: true,
        }
      };

      try {
        const response = await fetch(`${API_URL}/events/${originalEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedEventPayload),
        });
        if (!response.ok) throw new Error('Error updating event');
        
        const savedEvent = await response.json();
        setEvents(events.map((e) => (e.id === savedEvent.id ? savedEvent : e)));
      } catch (error) {
        console.error('Error updating event:', error);
      }
    }
    closeModal();
  };

  // delete
  const handleDelete = async () => {
    const eventId = modalState.eventData.id;
    try {
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error deleting event');
      
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
    closeModal();
  };
// drag & drop
  const handleEventChange = async (changeInfo) => {
    const event = changeInfo.event;

    // Payload for Drag and Drop
    const updatedEvent = {
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      allDay: event.allDay,

      extendedProps: {
        location: event.extendedProps.location,
        user: event.extendedProps.user,
        isFamily: event.extendedProps.isFamily,
      }
    };

    try {
      const response = await fetch(`${API_URL}/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
      });
      
      if (!response.ok) throw new Error('Error updating event drag/drop');
      
      // Optional: Refresh state from server to ensure sync
      const savedEvent = await response.json();
      setEvents(events.map((e) => (e.id === savedEvent.id ? savedEvent : e)));
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
        <Link to="/myschedule"><button className="my-cal">My Calendar</button></Link>
        <Link to="/familyschedule"><button className="fam-cal">Family Calendar</button></Link>
        <Link to="/combinedschedule"><button className="com-cal">Combined Calendar</button></Link>
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