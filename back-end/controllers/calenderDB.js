const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { CalendarEvent } = require("../db"); 

// GET Events
router.get('/events', async (req, res) => {
    try {
      const user = req.query.user; 
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
      console.error(error);
      res.status(500).json({ message: "Error fetching events" });
    }
});

// 2. POST (Create) Event
router.post('/events', async (req, res) => {
  try {
    const { title, start, location, user, isFamily, family } = req.body;

    const newEvent = new CalendarEvent({
      title,
      start,
      location: location || "",
      user,
      isFamily: Boolean(isFamily),
      family: family ? new mongoose.Types.ObjectId(family) : null
    });

    const saved = await newEvent.save();
    res.status(201).json(saved);

  } catch (error) {
    console.error("POST Error:", error);
    res.status(400).json({ message: error.message });
  }
});

//update
router.put('/events/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const allowed = {
        title: req.body.title,
        start: req.body.start,
        end: req.body.end,
        allDay: req.body.allDay ?? false,
        location: req.body.location,
        user: req.body.user,
        isFamily: req.body.isFamily,
        family: req.body.family ? new mongoose.Types.ObjectId(req.body.family) : null
      };

    const updated = await CalendarEvent.findByIdAndUpdate(
      id,
      allowed,
      { new: true }
    );
    res.json(updated);

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
