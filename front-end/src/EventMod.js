import React, { useState } from 'react';

export function EventModal({ event, onSave, onDelete, onClose }) {

  const [title, setTitle] = useState(event ? event.title : '');

  const handleSave = () => {
    if (title) {
      onSave(title);
    } else {
      alert('Title is required.');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{event ? 'Edit Event' : 'Add Event'}</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event Title"
        />
        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          {event && ( 
            <button onClick={onDelete} className="delete-btn">Delete</button>
          )}
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}