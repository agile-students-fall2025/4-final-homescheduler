import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventModal } from './EventMod';
import './MyCalender.css';
import { NavMenu } from "./NavMenu";

export function MyCalendar() {
   
  //helper
  
    // 1. Initial Events 
    const [events,setEvents] = useState([]);

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
            location: formData.location // Use formData.location
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
                  location: formData.location // Use formData.location
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
        <p className="no-reminders">No reminders yet. Add one in Reminders page!</p>
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