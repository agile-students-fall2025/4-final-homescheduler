import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventModal } from './EventMod';

export function MyCalendar() {
   
  
    // 1. Initial Events 
    const [events,setEvents] = useState([]);

    const [modalState, setModalState] = useState({
      isOpen: false,
      mode: 'add', // 'add' or 'edit'
      eventData: null, // Holds data for adding or event object for editing
    });
  
    // --- Event Handlers ---
  
    // 1. Open "Add Event" modal when a date is selected
    const handleSelect = (selectInfo) => {
      setModalState({
        isOpen: true,
        mode: 'add',
        eventData: selectInfo, // Pass the date info to the modal
      });
    };
  
    // 2. Open "Edit Event" modal when an event is clicked
    const handleEventClick = (clickInfo) => {
      setModalState({
        isOpen: true,
        mode: 'edit',
        eventData: clickInfo.event, // Pass the event object to the modal
      });
    };
    // 3. Handle saving the event (both add and edit)
  const handleSave = (title) => {
    if (modalState.mode === 'add') {
      const newEvent = {
        id: String(Date.now()), // Simple unique ID
        title: title,
        start: modalState.eventData.startStr,
        end: modalState.eventData.endStr,
        allDay: modalState.eventData.allDay,
      };
      setEvents([...events, newEvent]);
    } else if (modalState.mode === 'edit') {
      setEvents(
        events.map(event =>
          event.id === modalState.eventData.id
            ? { ...event, title: title } // Find event and update its title
            : event
        )
      );
    }
    closeModal();
  };
   // 4. Handle deleting an event
  const handleDelete = () => {
    setEvents(events.filter(event => event.id !== modalState.eventData.id));
    closeModal();
  };

  // 5. Handle drag-and-drop updates
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
  ////
  return (
    <div className="calendar-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        
        events={events} // Read events from state
        selectable={true}
        editable={true} // Allows drag-and-drop
        
        select={handleSelect} // Triggers "Add Event" modal
        eventClick={handleEventClick} // Triggers "Edit Event" modal
        eventChange={handleEventChange} // Handles drag-and-drop
      />

      {/* Render the modal component if isOpen is true */}
      {modalState.isOpen && (
        <EventModal
          // Pass the event object if editing, or null if adding
          event={modalState.mode === 'edit' ? modalState.eventData : null}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={closeModal}
        />
      )}
    </div>
  );
}