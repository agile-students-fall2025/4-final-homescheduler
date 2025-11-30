const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { CalendarEvent } = require("../db"); 

// GET Events
router.get('/events', async (req, res) => {
    try {
      const { user } = req.query; 
  
      let query = {};
      if (user) {
        // Filter: Show e
        query = { 
            $or: [
                { user: user }, 
                { isFamily: true }
            ] 
        };
      }
  
      // FIX: Changed 'Event' to 'CalendarEvent'
      const events = await CalendarEvent.find(query);
      res.json(events);
    } catch (error) {
      console.error("GET Error:", error);
      res.status(500).json({ message: error.message });
    }
});

// 2. POST (Create) Event
router.post('/events', async (req, res) => {
    try {
      // FIX: Changed 'Event' to 'CalendarEvent'
      const newEvent = new CalendarEvent(req.body);
      const savedEvent = await newEvent.save();
      res.status(201).json(savedEvent);
    } catch (error) {
      console.error("POST Error:", error);
      res.status(400).json({ message: error.message });
    }
});

//updatte
router.put('/events/:id', async (req, res) => {
    try {
      const { id } = req.params;
      let updateData = req.body;

      
      if (updateData.extendedProps) {
        updateData = {
            ...updateData,
            ...updateData.extendedProps
        };
        delete updateData.extendedProps;
      }

      const updatedEvent = await CalendarEvent.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true } 
      );

      res.json(updatedEvent);
    } catch (error) {
      console.error("PUT Error:", error);
      res.status(400).json({ message: error.message });
    }
});

// 4. DELETE Event
router.delete('/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await CalendarEvent.findByIdAndDelete(id);
        res.json({ message: "Event deleted" });
    } catch (error) {
        console.error("DELETE Error:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;