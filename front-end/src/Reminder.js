import React, { useState } from "react";
import "./Reminder.css";
import logo from './logo.png';
import { NavMenu } from "./NavMenu";

export default function Reminder() {
  const [form, setForm] = useState({
    title: "",
    month: "",
    day: "",
    year: "",
    time: "",
    notes: "",
    repeat: [], // ["Daily","Weekly","Monthly"]
    notify: "",
  });

  const [statusMessage, setStatusMessage] = useState("");   // ⬅️ NEW
  const [statusType, setStatusType] = useState("");         // "success" | "error

  const toggleRepeat = (value) => {
    setForm((prev) => {
      const has = prev.repeat.includes(value);
      return { ...prev, repeat: has ? prev.repeat.filter((v) => v !== value) : [...prev.repeat, value] };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


// This handleSubmit sends the data to the backend API
const handleSubmit = async (e) => {
  e.preventDefault();

  // rudimentary validation
  if (!form.title.trim()) {
    setStatusType("error")
    setStatusMessage("Please enter a reminder title.");
  setTimeout(() => {
    setStatusMessage("");
    setStatusType("");
  }, 8000);
    return;
  }
  if (!(form.month && form.day && form.year && form.time)) {
    setStatusType("error");
    setStatusMessage("Please fill in date and time.");
    setTimeout(() => {
    setStatusMessage("");
    setStatusType("");
  }, 4000);
    return;
  }
  // Build the payload for backend
  const payload = {
    title: form.title,
    month: form.month,
    day: form.day,
    year: form.year,
    time: form.time,
    notes: form.notes,
    repeat: form.repeat,
    notify: form.notify,
  };

  try {
    const res = await fetch("http://localhost:3001/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Failed to create reminder:", err);
      setStatusType("error");
      setStatusMessage("Sorry, something went wrong while saving your reminder.");
      return;
    }

    const newReminder = await res.json();
    console.log("Reminder created:", newReminder);

    setStatusType("success");
    setStatusMessage("Your reminder was added successfully!");
    setTimeout(() => {
      setStatusMessage("");
      setStatusType("");
    }, 4000);

    // clear form after successful submission
    setForm({
      title: "",
      month: "",
      day: "",
      year: "",
      time: "",
      notes: "",
      repeat: [],
      notify: "",
    });
  } catch (error) {
    console.error("Network or server error:", error);
    setStatusType("error");
    setStatusMessage("Could not connect to the server. Please try again.");
  }
};


  return (
        /*This is the image on the top */
    <div className="reminder-page">
      <NavMenu />
      <header className="reminder-header">
        <img className="app-logo" src={logo} alt = "AppLogo"/>
      </header>
    
        {/*This is the title of the page*/}

      <main className="reminder-main">
        <h1 className="reminder-title">Add a reminder</h1>

        {statusMessage && (
          <div className={`status-banner ${statusType}`}>
            {statusMessage}
          </div>
        )}

        <form className="reminder-form" onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            name="title"
            placeholder="reminder title"
            value={form.title}
            onChange={handleChange}
          />

          <div className="row gap">
            <input
              className="input small"
              type="text"
              inputMode="numeric"
              name="month"
              placeholder="month"
              maxLength={2}
              value={form.month}
              onChange={handleChange}
            />
            <input
              className="input small"
              type="text"
              inputMode="numeric"
              name="day"
              placeholder="day"
              maxLength={2}
              value={form.day}
              onChange={handleChange}
            />
            <input
              className="input small"
              type="text"
              inputMode="numeric"
              name="year"
              placeholder="year"
              maxLength={4}
              value={form.year}
              onChange={handleChange}
            />
          </div>

          <input
            className="input"
            type="time"
            name="time"
            placeholder="reminder time"
            value={form.time}
            onChange={handleChange}
          />

          <textarea
            className="textarea"
            name="notes"
            placeholder="reminder notes"
            rows={5}
            value={form.notes}
            onChange={handleChange}
          />

          <div className="repeat-row">
            <span className="label">repeat reminder:</span>
            <div className="repeat-chips">
              {["Daily", "Weekly", "Monthly"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`chip ${form.repeat.includes(opt) ? "selected" : ""}`}
                  aria-pressed={form.repeat.includes(opt)}
                  onClick={() => toggleRepeat(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="select-row">
            <label htmlFor="notify" className="sr-only">
              Notification time
            </label>
            <select
              id="notify"
              name="notify"
              className="select"
              value={form.notify}
              onChange={handleChange}
            >
              <option value="">set notification time</option>
              <option value="at_time">At time of event</option>
              <option value="5m">5 minutes before</option>
              <option value="10m">10 minutes before</option>
              <option value="15m">15 minutes before</option>
              <option value="30m">30 minutes before</option>
              <option value="1h">1 hour before</option>
              <option value="1d">1 day before</option>
            </select>
          </div>

          <div className="cta-row">
            <button type="submit" className="btn-primary">Add Reminder</button>
          </div>
        </form>
      </main>
    </div>
  );
}
