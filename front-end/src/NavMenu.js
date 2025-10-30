import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavMenu.css";

export function NavMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="nav-wrapper">
      {/* Hamburger icon */}
      <div className="hamburger" onClick={() => setOpen(!open)}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="menu">
          <button onClick={() => navigate("/home")}>Home</button>
          <button onClick={() => navigate("/myschedule")}>Master Calendar</button>
          <button onClick={() => navigate("/Reminders")}>Reminders</button>
          <button onClick={() => navigate("/settings")}>Settings</button>
        </div>
      )}
    </div>
  );
}
