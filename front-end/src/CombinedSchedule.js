import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './FamilySchedule.css';
import { NavMenu } from "./NavMenu";
import { Link } from "react-router-dom";

const API_URL = 'http://localhost:3001/api/calendar';

export function CombinedSchedule() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);

  // 1) Fetch the logged-in user (source of truth)
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/auth/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data);
      } else {
        console.error("Failed to fetch user:", data);
      }
    };

    fetchUser();
  }, []);

  // 2) Fetch combined events based on backend logic
  useEffect(() => {
    if (!user?.name) return;

    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `${API_URL}/events?user=${encodeURIComponent(user.name)}`
        );

        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [user]);

  // 3) Filter events (based on actual backend fields, NOT extendedProps)
  const combinedEvents = events.filter((e) => {
    return (
      e.user === user?.name ||
      (e.isFamily === true && e.family === user?.family)
    );
  });

  // 4) Show loading until user is fetched
  if (!user) {
    return <div>Loading user...</div>;
  }

  return (
    <div className="calendar-wrapper">
      <h2 id="familySchedule">Combined Calendar</h2>
      <p id="instruction">Your personal and family events together.</p>

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
        events={combinedEvents}
        selectable={false}
        editable={false}
      />
    </div>
  );
}