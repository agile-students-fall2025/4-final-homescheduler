import React, { useState,useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './FamilySchedule.css';
import { NavMenu } from "./NavMenu";
import { Link } from "react-router-dom";

const API_URL = 'http://localhost:3001/api';

console.log("--- CombinedSchedule component file was loaded ---");

export function CombinedSchedule() {
  console.log("--- CombinedSchedule component IS RENDERING ---")

  const [events, setEvents] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));
  const CURRENT_USER = userData?.name;

  // Only events that correspond to user OR family events
  const myEvents = events.filter(
     (e) => e.extendedProps?.user === CURRENT_USER ||
     e.extendedProps?.isFamily === true
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

  return (
    <div className="calendar-wrapper">
      <h2 id="familySchedule">Combined Calendar</h2>
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
        selectable={false}
        editable={false} // Enables drag-and-drop
        eventClick={() => {}}
        dateClick={null}
       
      />     
    </div>
  );
}