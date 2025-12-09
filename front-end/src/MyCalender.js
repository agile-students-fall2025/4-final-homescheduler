import React, { useState, useEffect, useMemo, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventModal } from './EventMod';
import './MyCalender.css';
import { NavMenu } from "./NavMenu";
import { Link } from "react-router-dom";

const API_URL = 'http://localhost:3001/api/calendar';

console.log("--- MySchedule component file was loaded ---");

// Replaced all instances of CURRENT_USER = "Me"
// Locally accesses user data to create event & filter events

export function MyCalendar() {
  console.log("--- MySchedule component IS RENDERING ---")

  const [events, setEvents] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loadingRem, setLoadingRem] = useState(false);
  const [errRem, setErrRem] = useState("");
  const [expandedReminderId, setExpandedReminderId] = useState(null);
  const [editingReminderId, setEditingReminderId] = useState(null);
  const [editReminderValues, setEditReminderValues] = useState({
    title: '',
    dueAt: '',
    notes: '',
  });
  const [expandedReminderId, setExpandedReminderId] = useState(null);

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
      e.user === CURRENT_USER &&
      (e.isFamily === false ||
       typeof e.isFamily === 'undefined')
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
  const toDateTimeLocal = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };


  const sortedReminders = useMemo(() => {
    return [...reminders].sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
  }, [reminders]);

  const dueSoon = (r) => msUntil(r.dueAt) <= 1000 * 60 * 60 && msUntil(r.dueAt) > 0; // within 1h

  const toggleExpandedReminder = (id) => {
  setExpandedReminderId((prev) => (prev === id ? null : id));
  };

  const deleteReminder = async (r) => {
  const toggleExpandedReminder = (id) => {
  setExpandedReminderId((prev) => (prev === id ? null : id));
  };

  const deleteReminder = async (r) => {
    try {
      // Adjust to your backend verb/route
      const res = await fetch(`${API_URL}/reminders/${r.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });


      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Remove from local state
      setReminders((prev) => prev.filter((x) => x.id !== r.id));

      // Remove from local state
      setReminders((prev) => prev.filter((x) => x.id !== r.id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete reminder.");
    }
  };

const saveReminderEdit = async (id) => {
  try {
    const body = {
      title: editReminderValues.title,
      notes: editReminderValues.notes,
    };

    // convert datetime-local back to ISO if user changed it
    if (editReminderValues.dueAt) {
      body.dueAt = new Date(editReminderValues.dueAt).toISOString();
    }

    const res = await fetch(`${API_URL}/reminders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const updated = await res.json();

    setReminders((prev) =>
      prev.map((r) => (r.id === id ? updated : r))
    );
    setEditingReminderId(null);
  } catch (e) {
    console.error(e);
    alert('Failed to update reminder.');
  }
};
  const startEditReminder = (r) => {
    setEditingReminderId(r.id);
    setEditReminderValues({
      title: r.title || '',
      dueAt: toDateTimeLocal(r.dueAt),
      notes: r.notes || '',
    });
  };

  const cancelEditReminder = () => {
    setEditingReminderId(null);
  };



  const fetchEvents = useCallback( async () => {
    try {
      const response = await fetch(`${API_URL}/events?user=${encodeURIComponent(CURRENT_USER)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  },[CURRENT_USER]);
   // --- Data Fetching ---
  // 1. Fetch events from the backend when the component mounts

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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
        family: null
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
          isFamily: false, 
          family: originalEvent.extendedProps?.family ?? null
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
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={myEvents} // Events now come from state, which is fed by the API
        selectable={true}
        editable={true} // Enables drag-and-drop
        select={handleSelect}
        eventClick={handleEventClick}
        eventChange={handleEventChange} // Called on drag/drop
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
              <li
                key={r.id}
                className={`reminder-item ${r.done ? 'done' : ''} ${
                  expandedReminderId === r.id ? 'expanded' : ''
                }`}
              >
                {/* Title row is clickable to expand/collapse details */}
                <div
                  className="reminder-title-row"
                  onClick={() => toggleExpandedReminder(r.id)}
                >
                  {/* Checkbox: mark complete & delete (no longer a “toggle done” only) */}
                  <input
                    type="checkbox"
                    onClick={(e) => e.stopPropagation()} // don't trigger expand when clicking box
                    onChange={() => deleteReminder(r)}
                    aria-label="complete and delete reminder"
                  />
                  <span className="reminder-title">{r.title}</span>
                  {dueSoon(r) && <span className="reminder-badge">Due soon</span>}
                
                  <button
                    className="reminder-edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditReminder(r);
                    }}
                  >
                    Edit
                  </button>
                </div>

                {editingReminderId === r.id ? (
                  <div className="reminder-edit-form">
                    <label>
                      Title:
                      <input
                        type="text"
                        value={editReminderValues.title}
                        onChange={(e) =>
                          setEditReminderValues((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                      />
                    </label>

                    <label>
                      Due at:
                      <input
                        type="datetime-local"
                        value={editReminderValues.dueAt}
                        onChange={(e) =>
                          setEditReminderValues((prev) => ({
                            ...prev,
                            dueAt: e.target.value,
                          }))
                        }
                      />
                    </label>

                    <label>
                      Notes:
                      <textarea
                        value={editReminderValues.notes}
                        onChange={(e) =>
                          setEditReminderValues((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                      />
                    </label>

                    <div className="reminder-edit-actions">
                      <button type="button" onClick={() => saveReminderEdit(r.id)}>
                        Save
                      </button>
                      <button type="button" onClick={cancelEditReminder}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (

                <div className="reminder-meta">
                  <span className="reminder-due">Due: {fmt(r.dueAt)}</span>
                </div>
                )}
                {/* Extra details only when expanded */}
                {expandedReminderId === r.id && (
                  <div className="reminder-details">
                    <p>
                      <strong>Description:</strong>{" "}
                      {r.notes || "No description provided."}
                    </p>
                    {/* These extra fields exist on the server-side PUT handler, so show them if present */}
                    <p>
                      <strong>Repeat:</strong>{" "}
                      {Array.isArray(r.repeat) && r.repeat.length > 0
                        ? r.repeat.join(", ")
                        : "None"}
                    </p>
                    <p>
                      <strong>Notify:</strong>{" "}
                      {typeof r.notify === "boolean" ? (r.notify ? "Yes" : "No") : "Not set"}
                    </p>
                  </div>
                )}
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
