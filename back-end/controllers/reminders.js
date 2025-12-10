// routes/reminders.js (CommonJS)
const express = require("express");
const router = express.Router();

const { Reminder } = require("../db");

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
router.get("/", async (req, res) => {
  try{
    const items = await Reminder.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to load reminders"})
  }
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const item = reminders.find(r => r.id === id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

// POST /api/reminders -> create a reminder
// POST /api/reminders -> create from form-shaped body
router.post("/", async (req, res) => {
  try {
    const { month, day, year, time, ...rest } = req.body;

    // Build dueAt from month/day/year/time
    const built = buildDueAtFromForm({ month, day, year, time });
    if (!built.ok) {
      return res.status(400).json({ error: built.error });
    }

    const reminder = await Reminder.create({
      ...rest,
      dueAt: built.iso,
      month,
      day,
      year,
      time,
    });

    res.status(201).json(reminder);
  } catch (err) {
    res.status(400).json({ error: "Failed to create reminder" });
  }
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

router.patch("/:id", async (req, res) => {
  try {
    const updated = await Reminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Reminder not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update reminder" });
  }
});

// DELETE /api/reminders/:id -> remove a reminder
router.delete("/:id", async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});


module.exports = router; // <-- export the router