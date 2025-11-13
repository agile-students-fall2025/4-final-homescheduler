import React, { useState,useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventModal } from './EventMod';
import './FamilySchedule.css';
import { NavMenu } from "./NavMenu";
import { Link } from "react-router-dom";

const API_URL = 'http://localhost:3001/api';

export const CURRENT_USER = 'Me';
//export const CURRENT_USER = localStorage.getItem("userName");
console.log("--- FamilySchedule component file was loaded ---");

export function FamilySchedule() {
  console.log("--- FamilySchedule component IS RENDERING ---")

  const [events, setEvents] = useState([]);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'add', // 'add' or 'edit'
    eventData: null, // Holds data for adding or event object for editing
  });
  const familyEvents = events.filter(
     (e) => e.extendedProps?.isFamily === true
   );
  // --- Data Fetching ---
  // 1. Fetch events from the backend when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/events`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      // You could set an error state here to show the user
    }
  };

  // --- Event Handlers ---

  // Open "Add Event" modal
  const handleSelect = (selectInfo) => {
    setModalState({
      isOpen: true,
      mode: 'add',
      eventData: selectInfo,
    });
  };

  // Open "Edit Event" modal
  const handleEventClick = (clickInfo) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      eventData: clickInfo.event,
    });
  };

  // 6. Close the modal
  const closeModal = () => {
    setModalState({ isOpen: false, mode: 'add', eventData: null });
  };

  // --- C.R.U.D. Operations ---

  // [CREATE / UPDATE] Save new event or update existing one
  const handleSave = async (formData) => {
    // formData is { title, location, time }
    if (modalState.mode === 'add') {
      // --- CREATE ---
      const date = modalState.eventData.startStr;
      const startDateTime = `${date}T${formData.time}:00`;

      const newEventData = {
        title: formData.title,
        start: startDateTime,
        location: formData.location,
        user: CURRENT_USER, // Add the current user
        isFamily: true,
      };

      try {
        const response = await fetch(`${API_URL}/events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEventData),
        });
        if (!response.ok) throw new Error('Error creating event');
        const createdEvent = await response.json();
        // Add the new event (from server) to our local state
        setEvents([...events, createdEvent]);
      } catch (error) {
        console.error('Error creating event:', error);
      }
    } else if (modalState.mode === 'edit') {
      // --- UPDATE ---
      const originalEvent = modalState.eventData;
      const date = new Date(originalEvent.start).toISOString().substring(0, 10);
      const startDateTime = `${date}T${formData.time}:00`;

      const updatedEvent = {
        ...originalEvent.toPlainObject(), // Get all existing props
        title: formData.title,
        start: startDateTime,
        allDay: false,
        extendedProps: {
          ...originalEvent.extendedProps,
          location: formData.location,
          // We don't update the 'user' here, as we're just editing.
          // You could add an 'lastEditedBy' field if you wanted.
        },
      };

      try {
        const response = await fetch(
          `${API_URL}/events/${originalEvent.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEvent),
          }
        );
        if (!response.ok) throw new Error('Error updating event');
        const savedEvent = await response.json();
        // Update the event in our local state
        setEvents(
          events.map((e) => (e.id === savedEvent.id ? savedEvent : e))
        );
      } catch (error) {
        console.error('Error updating event:', error);
      }
    }
    closeModal();
  };

  // [DELETE] Delete an event
  const handleDelete = async () => {
    const eventId = modalState.eventData.id;
    try {
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error deleting event');
      // Remove the event from local state
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
    closeModal();
  };

  // [UPDATE] Handle drag-and-drop or resize
  const handleEventChange = async (changeInfo) => {
    const event = changeInfo.event;

    // Create a plain object to send as JSON
    const updatedEvent = {
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      allDay: event.allDay,
      extendedProps: event.extendedProps,
    };

    try {
      const response = await fetch(`${API_URL}/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      });
      if (!response.ok) throw new Error('Error updating event drag/drop');

      // Optimistic update is already handled by FullCalendar's UI
      // But we can refetch or just trust the local change.
      // For robustness, let's update our state from the server response.
      const savedEvent = await response.json();
      setEvents(events.map((e) => (e.id === savedEvent.id ? savedEvent : e)));
    } catch (error) {
      console.error('Error updating event (drag/drop):', error);
      // Revert the change if the API call failed
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
        events={familyEvents} // Events now come from state, which is fed by the API
        selectable={true}
        editable={true} // Enables drag-and-drop
        select={handleSelect}
        eventClick={handleEventClick}
        eventChange={handleEventChange} // Called on drag/drop
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