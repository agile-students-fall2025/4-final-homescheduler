const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { CalendarEvent } = require("../db"); 

// 1. GET Events (Keep existing logic, it looked okay)
router.get('/', async (req, res) => {
    try {
      const { user } = req.query; 
      let query = {};
      
      if (user) {
        query = { 
            $or: [
                { 'extendedProps.user': user }, 
                { 'extendedProps.isFamily': true }
            ] 
        };
      }
      
      const events = await CalendarEvent.find(query);
      res.json(events);
    } catch (error) {
      console.error("GET Error:", error);
      res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
      const { title, start, end, allDay, extendedProps } = req.body;

      const newEvent = new CalendarEvent({
        title,
        start,
        end,
        allDay,
       
        user: extendedProps?.user, 
        location: extendedProps?.location,
        isFamily: extendedProps?.isFamily,
      
      });

      const savedEvent = await newEvent.save();
      res.status(201).json(savedEvent);
    } catch (error) {
      console.error("POST Error:", error);
      res.status(400).json({ message: error.message });
    }
});

// PUT (Update)
router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, start, end, allDay, extendedProps } = req.body;

      const updateData = {
          title,
          start,
          end, 
          allDay
      };

      if (extendedProps) {
          if (extendedProps.user) updateData.user = extendedProps.user;
          if (extendedProps.location) updateData.location = extendedProps.location;
          if (typeof extendedProps.isFamily !== 'undefined') updateData.isFamily = extendedProps.isFamily;
      }

      const updatedEvent = await CalendarEvent.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true } // Return the updated doc
      );

      res.json(updatedEvent);
    } catch (error) {
      console.error("PUT Error:", error);
      res.status(400).json({ message: error.message });
    }
});

// 4. DELETE Event
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
       
        const result = await CalendarEvent.findOneAndDelete({ id: id });
        
        if (!result) {
            return res.status(404).json({ message: "Event not found" });
        }
        
        res.json({ message: "Event deleted" });
    } catch (error) {
        console.error("DELETE Error:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;