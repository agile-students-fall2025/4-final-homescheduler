import React, { useState, useEffect, useMemo, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // ADDED: For Week/Day view
import interactionPlugin from '@fullcalendar/interaction';
import { EventModal } from './EventMod';
import './MyCalender.css';
import { NavMenu } from "./NavMenu";
import { Link } from "react-router-dom";

const API_URL = 'http://localhost:3001/api';

console.log("--- MySchedule component file was loaded ---");

export function MyCalendar() {
  console.log("--- MySchedule component IS RENDERING ---")

  const [events, setEvents] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loadingRem, setLoadingRem] = useState(false);
  const [errRem, setErrRem] = useState("");

  const userData = JSON.parse(localStorage.getItem("user"));
  const CURRENT_USER = userData?.name;

  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'add', // 'add' or 'edit'
    eventData: null, // Holds data for adding or event object for editing
  });

  const myEvents = useMemo(() => {
  return events.filter(
    (e) =>
      // Events with user that corresponds to current user and no family events
      e.extendedProps?.user === CURRENT_USER &&
      (e.extendedProps?.isFamily === false ||
       typeof e.extendedProps?.isFamily === 'undefined')
  );
}, [events, CURRENT_USER]);

  // --- Fetch reminders ---
  const fetchReminders = useCallback( async () => {
    try {
      setLoadingRem(true);
      setErrRem("");
      // Adjust this URL to match your backend route
      const res = await fetch(
        `${API_URL}/reminders?user=${encodeURIComponent(CURRENT_USER)}`, 
      {
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // Expect each reminder like: { id, title, dueAt, notes?, done? }
      setReminders(Array.isArray(data) ? data : []);
    } catch (e) {
      setErrRem("Couldn't load reminders.");
      console.error(e);
    } finally {
      setLoadingRem(false);
    }
  },[CURRENT_USER]);

  

  // Small helpers
  const fmt = (iso) => new Date(iso).toLocaleString();
  const msUntil = (iso) => new Date(iso).getTime() - Date.now();

  const sortedReminders = useMemo(() => {
    return [...reminders].sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
  }, [reminders]);

  const dueSoon = (r) => msUntil(r.dueAt) <= 1000 * 60 * 60 && msUntil(r.dueAt) > 0; // within 1h

  const toggleDone = async (r) => {
    try {
      // Adjust to your backend verb/route
      const res = await fetch(`http://localhost:3001/api/reminders/${r.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !r.done })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setReminders((prev) =>
        prev.map((x) => (x.id === r.id ? { ...x, done: !r.done } : x))
      );
    } catch (e) {
      console.error(e);
      alert("Failed to update reminder.");
    }
  };

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
   // --- Data Fetching ---
  // 1. Fetch events from the backend when the component mounts

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchReminders();
    // Optional: auto-refresh every 60s so new backend reminders pop in
    const t = setInterval(fetchReminders, 60000);
    return () => clearInterval(t);
  }, [fetchReminders]);
 
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

      const userData = JSON.parse(localStorage.getItem("user"));
      const CURRENT_USER = userData?.name;

      const newEventData = {
        title: formData.title,
        start: startDateTime,
        location: formData.location,
        user: CURRENT_USER, // Add the current user
        isFamily: false,
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
          isFamily: false
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
      <h2 id="mySchedule">My Calendar</h2>
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
        // UPDATED: ADDED timeGridPlugin
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} 
        
        // ADDED: CONFIGURATION FOR MONTH/WEEK/DAY BUTTONS
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay' 
        }}
        initialView="dayGridMonth"
        events={myEvents} 
        selectable={true}
        editable={true} 
        select={handleSelect}
        eventClick={handleEventClick}
        eventChange={handleEventChange} 
      />

      <div className="reminder-section">
        <h3>Reminders</h3>

        {loadingRem && <p className="no-reminders">Loading…</p>}
        {errRem && <p className="no-reminders">{errRem}</p>}

        {!loadingRem && !errRem && sortedReminders.length === 0 && (
          <p className="no-reminders">No reminders yet. Add one in Reminders page!</p>
        )}

        {!loadingRem && !errRem && sortedReminders.length > 0 && (
          <ul className="reminder-list">
            {sortedReminders.map((r) => (
              <li key={r.id} className={`reminder-item ${r.done ? 'done' : ''}`}>
                <div className="reminder-title-row">
                  <input
                    type="checkbox"
                    checked={!!r.done}
                    onChange={() => toggleDone(r)}
                    aria-label="mark reminder done"
                  />
                  <span className="reminder-title">{r.title}</span>
                  {dueSoon(r) && <span className="reminder-badge">Due soon</span>}
                </div>
                <div className="reminder-meta">
                  <span className="reminder-due">Due: {fmt(r.dueAt)}</span>
                  {r.notes ? <span className="reminder-notes"> · {r.notes}</span> : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

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