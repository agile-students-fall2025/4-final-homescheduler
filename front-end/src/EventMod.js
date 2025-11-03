import React, { useState, useEffect } from 'react';
import './EventModal.css';

// A helper function to get "HH:mm" from a Date object or string
const formatTime = (date) => {
  if (!date) return '09:00'; // Default for new events
  return new Date(date).toTimeString().substring(0, 5); 
};

export function EventModal({ event, onSave, onDelete, onClose, currentUser }) {
  
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('09:00');


  const isEditing = !!event;

  // This effect populates the form when 'event' (for editing) is passed in
  useEffect(() => {
    if (event) {
      // We are in 'Edit' mode
      setTitle(event.title);
      setLocation(event.extendedProps.location || '');
      setTime(formatTime(event.start));
    } else {
      // We are in 'Add' mode
      setTitle('');
      setLocation('');
      setTime('09:00');
    }
  }, [event]); 
  
  const handleSave = () => {
    if (title.trim()) { 
      onSave({ title, location, time }); 
    } else {
      alert('Event Title is required.');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
        <div className="header-left">
          <h2>{isEditing ? 'Edit Event' : 'Add Event'}</h2>
          {currentUser && (
            <p className="user">
              Added by {currentUser}
            </p>
          )}
          </div>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event Title"
          />

          <label>Time:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Event Location"
          />
        </div>
        
        <div className="modal-actions">
          <button onClick={handleSave} className="save-btn">Save</button>
          
          {isEditing && ( 
            <button onClick={onDelete} className="delete-btn">Delete</button>
          )}
          
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
}