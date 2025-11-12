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
    done: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
    },
    { id: "2",
    title: "Study ECE exam",
    dueAt: "2025-11-12T18:00:00Z",
    notes: "Chapters 3-5",
    repeat: ["Daily"],
    notify: "30m",
    done: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
    }
];

function zeroPad(n){
  return String(n).padStart(2, "0");
}

function buildDueAtFromForm({ month, day, year, time}){
  if (!year || !month || !day){
    return { ok: false, error: "year, month, and day are required" };
  }
  const y = Number(year), m = Number(month), d = Number(day);
  if (!(y >= 1970 && y <= 2100)) return { ok: false, error: "year out of range" };
  if (!(m >= 1 && m <= 12)) return { ok: false, error: "month must be 1–12" };
  if (!(d >= 1 && d <= 31)) return { ok: false, error: "day must be 1–31" };

  const hhmm = time && /^\d{1,2}:\d{2}$/.test(time) ? time : "00:00";
  const [hhStr, mmStr] = hhmm.split(":");
  const hh = Number(hhStr), mm = Number(mmStr);
  if (!(hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59)) {
    return { ok: false, error: "time must be HH:MM (24h)" };
  }
  const iso = new Date(
    `${y}-${zeroPad(m)}-${zeroPad(d)}T${zeroPad(hh)}:${zeroPad(mm)}:00`
  ).toISOString();

  if (iso === "Invalid Date") return { ok: false, error: "invalid date/time" };
    return { ok: true, iso };
}

// GET /api/reminders  -> list all reminders
router.get("/", (req, res) => {
  res.json(reminders);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const item = reminders.find(r => r.id === id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

// POST /api/reminders -> create a reminder
// POST /api/reminders -> create from form-shaped body
router.post("/", (req, res) => {
  const { title, month, day, year, time, notes, repeat, notify, dueAt } = req.body || {};
  if (!title) return res.status(400).json({ error: "title is required" });

  // If form fields provided, build dueAt from them; else allow a raw dueAt string or default to now
  let finalDueAt = dueAt || null;
  if (month || day || year || time) {
    const built = buildDueAtFromForm({ month, day, year, time });
    if (!built.ok) return res.status(400).json({ error: built.error });
    finalDueAt = built.iso;
  }
  if (!finalDueAt) finalDueAt = new Date().toISOString();

  const nextId = (Math.max(0, ...reminders.map(r => Number(r.id))) + 1).toString();
  const now = new Date().toISOString();

  const newItem = {
    id: nextId,
    title: String(title),
    dueAt: finalDueAt,
    notes: notes ?? "",
    repeat: Array.isArray(repeat) ? repeat : [],
    notify: notify ?? "off",
    done: typeof done === "boolean" ? done : false,
    createdAt: now,
    updatedAt: now
  };

  reminders.push(newItem);
  res.status(201).json(newItem);
});
// PUT /api/reminders/:id -> update a reminder
router.put("/:id", (req, res) => {
  const { id } = req.params;

  // Find the reminder to update
  const idx = reminders.findIndex(r => r.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Reminder not found" });
  }

  const current = reminders[idx];
  const { title, month, day, year, time, notes, repeat, notify, dueAt } = req.body || {};

  // If date parts are provided, rebuild the dueAt
  let nextDueAt = current.dueAt;
  if (month || day || year || time) {
    const built = buildDueAtFromForm({ month, day, year, time });
    if (!built.ok) return res.status(400).json({ error: built.error });
    nextDueAt = built.iso;
  } else if (dueAt) {
    nextDueAt = dueAt; // Allow direct ISO update
  }

  // Create updated reminder
  const updated = {
    ...current,
    title: title ?? current.title,
    dueAt: nextDueAt,
    notes: notes ?? current.notes,
    repeat: Array.isArray(repeat) ? repeat : current.repeat,
    notify: notify ?? current.notify,
    done: typeof done === "boolean" ? done : current.done,
    updatedAt: new Date().toISOString()
  };

  // Replace the old one in memory
  reminders[idx] = updated;

  res.json(updated);
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { done } = req.body || {};

  const idx = reminders.findIndex(r => r.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Reminder not found" });
  }

  const current = reminders[idx];

  // Toggle or set done field
  const updated = {
    ...current,
    done: typeof done === "boolean" ? done : current.done,
    updatedAt: new Date().toISOString()
  };

  reminders[idx] = updated;

  res.json(updated);
});

// DELETE /api/reminders/:id -> remove a reminder
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  // Find the index of the reminder
  const idx = reminders.findIndex(r => r.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Reminder not found" });
  }

  // Remove it from the array and return the deleted object
  const removed = reminders.splice(idx, 1)[0];
  res.json({
    message: "Reminder deleted successfully",
    deleted: removed
  });
});

module.exports = router; // <-- export the router