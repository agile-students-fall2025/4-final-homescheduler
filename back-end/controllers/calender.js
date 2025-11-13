const express = require('express');
const crypto = require('crypto');
const router = express.Router();

//in memory data
let events = [
    {
      id: '1678886400000',
      title: 'Team Meeting',
      start: '2025-11-12T10:30:00',
      allDay: false,
      extendedProps: {
        location: 'Conference Room B',
        user: 'Alice',
        isFamily: true,
      },
    },
    {
      id: '1678972800000',
      title: 'Dentist Appointment',
      start: '2025-11-15T14:00:00',
      allDay: false,
      extendedProps: {
        location: 'Downtown Dental',
        user: 'Bob',
        isFamily: true,
      },
    },
  ];


 

router.get('/', (req, res) => {
    console.log('GET /api/events');
    res.json(events);
  });
  
//post
  router.post('/', (req, res) => {
    console.log('POST /api/events', req.body);
  
    const { title, start, location, user, isFamily } = req.body;
  
    if (!title || !start || !user) {
      return res
        .status(400)
        .json({ error: 'Missing required fields: title, start, user' });
    }
  
    const newEvent = {
      // Create a new unique ID
      id: crypto.randomUUID(),
      title,
      start,
      allDay: false, // You can make this part of the request body if needed
      extendedProps: {
        location: location || '',
        user: user, 
        isFamily: !!isFamily,
      },
    };
  
    events.push(newEvent);
    // Send the newly created event back to the client
    res.status(201).json(newEvent);
  });
  
  // [UPDATE] 
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const updatedEventData = req.body;
    console.log(`PUT /api/events/${id}`, updatedEventData);
  
    let eventFound = false;
    events = events.map((event) => {
      if (event.id === id) {
        eventFound = true;
        // Merge the existing event with the new data
        return { ...event, ...updatedEventData };
      }
      return event;
    });
  
    if (eventFound) {
      // Find and return the updated event
      const updatedEvent = events.find((e) => e.id === id);
      res.json(updatedEvent);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  });
  
  // delete
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    console.log(`DELETE /api/events/${id}`);
  
    const eventIndex = events.findIndex((event) => event.id === id);
  
    if (eventIndex > -1) {
      events.splice(eventIndex, 1);
      
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  });
  
  // Export the router so server.js can use it
  module.exports = router;