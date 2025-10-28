import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './FamilySchedule.css';

export function FamilySchedule() {
  const calendarRef = useRef(null);


  // 2. Initial Events 
  const initialEvents = [
    { title: 'Project Deadline', date: '2025-10-25', color: 'red' },
    { title: 'Team Meeting', start: '2025-10-28T10:00:00', end: '2025-10-28T12:00:00' }
  ];
  const [events, setEvents] = useState(initialEvents);
  const [eventName, setEName] = useState('');
  const [eventLocation, setELocation] = useState('');
  const [eventStart, setEStart] = useState('');
  const [formVisible, setFormVisible] = useState(false);

  // 1. Event Handlers
  // This function runs when a date is clicked
  const handleDateClick = (arg) => {
    
    const base = arg.dateStr.includes('T') ? arg.dateStr : `${arg.dateStr}T09:00`;
    setEStart(base);
    setFormVisible(true);
    
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    const api = calendarRef.current?.getApi();
    if (!api) return;

    //add seconds to time
    const startDate = new Date(eventStart.length === 16 ? `${eventStart}:00` : eventStart);
    const created = {
      //new item populated
      title: eventName,
      start: startDate,
      extendedProps: { location: eventLocation },
      id: Date.now().toString()
    };
    setEvents((prev) => [...prev, created]);

    // Clear fields
    setEName('');
    setELocation('');
    setEStart('');
  };

  return (
    <div className="calendar-wrapper">
      <h2 id = "familySchedule">Family Schedule</h2>
      <button id ="addButton" type="button" onClick={() => setFormVisible(true)}>
        
        Add Event
      </button>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        dateClick={handleDateClick}
        editable={true}
        selectable={true}
      />
    

      {formVisible && (
        <div className = "popup-background">
          <div className= "popup-form">
          <form onSubmit={handleSubmit}>{}
        <h2>Add Event</h2>
        <input
          type="text"
          placeholder="event name"
          value={eventName}
          onChange={(e) => setEName(e.target.value)}
        />
        <input
          type="text"
          placeholder="event location"
          value={eventLocation}
          onChange={(e) => setELocation(e.target.value)}
        />
        <input
          type="datetime-local"
          placeholder="event start time"
          value={eventStart}
          onChange={(e) => setEStart(e.target.value)}
        />
        
        <button 
        type="submit"
        className = "eventSubmit">
        Submit
        </button>

        <button 
          type="button" 
          className = "eventCancel" 
          onClick={() => setFormVisible(false)}>
          Cancel
        </button>
        </form>{}
      </div>
    </div>
      )}
</div>

  );
}
