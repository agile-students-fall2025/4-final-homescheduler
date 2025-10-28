import React, { useState } from 'react';

import './EventModal.css';

export function EventModal({ event, onSave, onDelete, onClose }) {
  
   
    const [title, setTitle] = useState(event ? event.title : '');
  

    const isEditing = !!event;
  
    const handleSave = () => {
      if (title.trim()) { 
        onSave(title);
      } else {
        alert('Event Title is required.');
      }
    };
  
    return (
     
      <div className="modal-backdrop" onClick={onClose}>
       
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          
          <div className="modal-header">
            <h2>{isEditing ? 'Edit Event' : 'Add Event'}</h2>
            <button className="close-button" onClick={onClose}>&times;</button>
          </div>
  
          <div className="modal-body">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event Title"
                className="event-title-input"
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