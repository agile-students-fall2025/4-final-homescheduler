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


  //This handleSubmit sends a popup if there is nothing placed in the boxes.
  const handleSubmit = (e) => {
    e.preventDefault();

    // rudimentary validation
    if (!form.title.trim()) {
      alert("Please enter a reminder title.");
      return;
    }
    if (!(form.month && form.day && form.year && form.time)) {
      alert("Please fill in date and time.");
      return;
    }

    // You can wire this to your back-end later:
    console.log("Reminder payload:", form);
    alert("Reminder added! (Check console for payload)");

    // clear form
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

        {/* */}

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
            <span className="select-caret" aria-hidden>▾</span>
          </div>

          <div className="cta-row">
            <button type="submit" className="btn-primary">Add Reminder</button>
          </div>
        </form>
      </main>
    </div>
  );
}
