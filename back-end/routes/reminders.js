// routes/reminders.js (CommonJS)
const express = require("express");
const router = express.Router();

// In-memory mock data
let reminders = [
  { id: "1",
    title: "Buy milk",
    dueAt: "2025-11-10T09:00:00Z",
    notes: "",
    repeat: [],
    notify: "off",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
    },
    { id: "2",
    title: "Study ECE exam",
    dueAt: "2025-11-12T18:00:00Z",
    notes: "Chapters 3-5",
    repeat: ["Daily"],
    notify: "30m",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
    }
];

// GET /api/reminders  -> list all reminders
router.get("/", (req, res) => {
  res.json(reminders);
});

// POST /api/reminders -> create a reminder
router.post("/", (req, res) => {
  const { title, dueAt, notes, repeat, notify } = req.body || {};
  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  // compute next id (string)
  const nextId = (Math.max(0, ...reminders.map(r => Number(r.id))) + 1).toString();
  const now = new Date().toISOString();

  const newItem = {
    id: nextId,
    title: String(title),
    dueAt: dueAt || now,
    notes: notes ?? "",
    repeat: Array.isArray(repeat) ? repeat : [],
    notify: notify ?? "off",
    createdAt: now,
    updatedAt: now
  };

  reminders.push(newItem);
  res.status(201).json(newItem);
});


module.exports = router; // <-- export the router

