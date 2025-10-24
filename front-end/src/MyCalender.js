import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';


export function MyCalendar() {
    // 1. Event Handlers
    // This function runs when a date is clicked
    const handleDateClick = (arg) => {
      alert('Date clicked: ' + arg.dateStr);
      // You could open a modal here to add a new event
    };
  
    // 2. Initial Events (Simulated data)
    const initialEvents = [
      { title: 'Project Deadline', date: '2025-10-25', color: 'red' },
      { title: 'Team Meeting', start: '2025-10-28T10:00:00', end: '2025-10-28T12:00:00' }
    ];
  
    return (
      <div className="calendar-wrapper" >
        <FullCalendar
          // Basic configuration
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth" // Starts with a monthly view
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay' // Allows switching views
          }}
  
          // Data and Interaction
          events={initialEvents}
          dateClick={handleDateClick}
          editable={true} // Allows events to be moved/resized
          selectable={true} // Allows selecting a range of dates
  
          // Appearance
         // height="auto" // Calendar height adjusts to content
        />
      </div>
    );
  }