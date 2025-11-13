import React, { useState, useEffect, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventModal } from './EventMod';
import './MyCalender.css';
import { NavMenu } from "./NavMenu";

export function MyCalendar() {
  const currentUser = "[user]"
   
  //helper
  
    // 1. Initial Events 
    const [events,setEvents] = useState([]);

        // Reminders state
    const [reminders, setReminders] = useState([]);
    const [loadingRem, setLoadingRem] = useState(false);
    const [errRem, setErrRem] = useState("");

    // --- Fetch reminders ---
    const fetchReminders = async () => {
      try {
        setLoadingRem(true);
        setErrRem("");
        // Adjust this URL to match your backend route
        const res = await fetch(`http://localhost:3001/api/reminders?user=${encodeURIComponent(currentUser)}`, {
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
    };

    useEffect(() => {
      fetchReminders();
      // Optional: auto-refresh every 60s so new backend reminders pop in
      const t = setInterval(fetchReminders, 60000);
      return () => clearInterval(t);
    }, []);

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

    const [modalState, setModalState] = useState({
      isOpen: false,
      mode: 'add', // 'add' or 'edit'
      eventData: null, // Holds data for adding or event object for editing
    });
  
    // --- Event Handlers ---
  
    // Open "Add Event" modal when a date is selected
    const handleSelect = (selectInfo) => {
      setModalState({
        isOpen: true,
        mode: 'add',
        eventData: selectInfo,
      });
    };
  
    // 2. Open "Edit Event" modal when an event is clicked
    const handleEventClick = (clickInfo) => {
      setModalState({
        isOpen: true,
        mode: 'edit',
        eventData: clickInfo.event, 
      });
    };
    // saving the event
    const handleSave = (formData) => {
      // formData is now { title, location, time }
      
      if (modalState.mode === 'add') {
        const date = modalState.eventData.startStr;
        const startDateTime = `${date}T${formData.time}:00`; // Combine date and time
    
        const newEvent = {
          id: String(Date.now()),
          title: formData.title,    // Use formData.title
          start: startDateTime,
          allDay: false,
          extendedProps: {
            location: formData.location, // Use formData.location
            createdBy: currentUser
          }
        };
        setEvents([...events, newEvent]);
    } else if (modalState.mode === 'edit') {
      const originalEvent = modalState.eventData;
      const date = new Date(originalEvent.start).toISOString().substring(0, 10);
      const startDateTime = `${date}T${formData.time}:00`;

      setEvents(
        events.map(event =>
          event.id === originalEvent.id
            ? { 
                ...event, 
                title: formData.title, // Use formData.title
                start: startDateTime,
                allDay: false,
                extendedProps: {
                  location: formData.location, // Use formData.location
                  createdBy: currentUser
                }
              }
            : event
        )
      );
    }
    closeModal();
  };
   //delete an event
  const handleDelete = () => {
    setEvents(events.filter(event => event.id !== modalState.eventData.id));
    closeModal();
  };

  //drag and drop update
  const handleEventChange = (changeInfo) => {
    setEvents(
      events.map(event =>
        event.id === changeInfo.event.id
          ? { ...event, start: changeInfo.event.startStr, end: changeInfo.event.endStr }
          : event
      )
    );
  };
  
  // 6. Close the modal
  const closeModal = () => {
    setModalState({ isOpen: false, mode: 'add', eventData: null });
  };


  return (
    <div className="calendar-wrapper">
      <h2 id = "mySchedule">Schedule</h2>
      <p id = "instruction">Select a date to add / edit an event.</p>
      <NavMenu />
      <div className="calendar-toggle">
    
  <button className="my-cal">My Calendar</button>
  <button className="fam-cal">Family Calendar</button>
  <button className="com-cal">Combined Calendar</button>
  </div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        
        
        events={events} 
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
          currentUser={currentUser}
        />
      )}
      
    </div>
    
  );
  
}