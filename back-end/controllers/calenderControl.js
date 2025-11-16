const crypto = require('crypto');
const { eventNames } = require('process');
const path = require('path');
const fs = require('fs');

const eventPath = path.join(process.cwd(), 'data', 'events.json');

const readEvents = () => {
  if (!fs.existsSync(eventPath)) return [];
  return JSON.parse(fs.readFileSync(eventPath, 'utf-8'));
};

const writeEvents = (data) => {
  fs.writeFileSync(eventPath, JSON.stringify(data, null, 2));
};

exports.getEvents =  async (req, res) => {
    const events = readEvents();
    res.json(events);
  };
  
//post
  exports.createEvent = async (req, res) => {
    const { title, start, location, user, isFamily } = req.body;
  
    if (!title || !start || !user) {
      return res
        .status(400)
        .json({ error: 'Missing required fields: title, start, user' });
    }

    const allEvents = readEvents();

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

    allEvents.push(newEvent);
    writeEvents(allEvents);
    res.status(201).json(newEvent)
  };
  
  // [UPDATE] 
  exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const updatedEventData = req.body;

    let allEvents = readEvents()
    let eventFound = false;
    allEvents = allEvents.map((event) => {
      if (event.id === id) {
        eventFound = true;
        return { ...event, ...updatedEventData };
      }
      return event;
    });
  
    if (!eventFound) {
      res.status(404).json({ error: 'Event not found' });
    }
    writeEvents(allEvents);
    const updatedEvent = allEvents.find((e) => e.id === id);
    res.json(updatedEvent);

  };
  
  // delete
  exports.deleteEvent = async (req, res) => {
    const { id } = req.params;

    const eventData = readEvents();
    const eventIndex = eventData.findIndex((event) => event.id === id);
  
    if (eventIndex === -1) {
      return res.status(404).json({ error: 'Event not found' });
    }
    eventData.splice(eventIndex, 1);
    writeEvents(eventData);

    return res.status(200).json({message: "Event deleted successfully"});
    };