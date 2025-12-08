import React, { useState,useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './FamilySchedule.css';
import { NavMenu } from "./NavMenu";
import { Link } from "react-router-dom";

const API_URL_PERSONAL = 'http://localhost:3001/api';
const API_URL_FAMILY   = 'http://localhost:3001/api/calendar';


console.log("--- CombinedSchedule component file was loaded ---");

export function CombinedSchedule() {
  console.log("--- CombinedSchedule component IS RENDERING ---")

  const [events, setEvents] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));
  const CURRENT_USER = userData?.name;
  const userFamilyId = userData?.familyId;

  // Only events that correspond to user OR family events
  const myEvents = events.filter((e) => {
    const eventUser = e.extendedProps?.user || e.user;
    const isFamily =
      e.extendedProps?.isFamily === true || e.isFamily === true;
    const famId = 
      e.extendedProps?.familyId === true || e.familyId;

    return eventUser === CURRENT_USER || (isFamily && famId === userFamilyId);
  });
  // --- Data Fetching ---
  // 1. Fetch events from the backend when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // Fetch personal & family events
      const [personalRes, familyRes] = await Promise.all([
        fetch(`${API_URL_PERSONAL}/events?user=${encodeURIComponent(CURRENT_USER)}`),
        fetch(`${API_URL_FAMILY}/events?user=${encodeURIComponent(CURRENT_USER)}`),
      ]);

      if (!personalRes.ok || !familyRes.ok) {
        throw new Error('One calendar failed');
      }

      const personalEvents = await personalRes.json();
      const familyEvents = await familyRes.json();
      //combine both calendars
      const allEvents = personalEvents.concat(familyEvents);

      setEvents(allEvents);
    } catch (error) {
      console.error('Error combining events:', error);
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