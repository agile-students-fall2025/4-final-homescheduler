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
  const handleSave = (title) => {
    if (modalState.mode === 'add') {
      const newEvent = {
        id: String(Date.now()), 
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
            ? { ...event, title: title } 
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
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        
        events={events} 
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