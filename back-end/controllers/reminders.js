const express = require("express");
const router = express.Router();
const { Reminder } = require("../db");

// Helper to zero-pad values like 03, 09, etc.
const zeroPad = (n) => String(n).padStart(2, "0");

/**
 * Convert Month/Day/Year + Time into ISO string
 */
function buildDueAtFromForm({ month, day, year, time }) {
  if (!year || !month || !day)
    return { ok: false, error: "year, month, and day are required" };

  const y = Number(year);
  const m = Number(month);
  const d = Number(day);

  if (!(y >= 1970 && y <= 2100)) return { ok: false, error: "year out of range" };
  if (!(m >= 1 && m <= 12)) return { ok: false, error: "month must be 1–12" };
  if (!(d >= 1 && d <= 31)) return { ok: false, error: "day must be 1–31" };

  const hhmm = /^\d{1,2}:\d{2}$/.test(time) ? time : "00:00";
  const [hhStr, mmStr] = hhmm.split(":");

  const hh = Number(hhStr);
  const mm = Number(mmStr);

  if (!(hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59))
    return { ok: false, error: "time must be HH:MM (24h)" };

  const iso = new Date(
    `${y}-${zeroPad(m)}-${zeroPad(d)}T${zeroPad(hh)}:${zeroPad(mm)}:00`
  ).toISOString();

  return iso === "Invalid Date" ? { ok: false, error: "invalid date" } : { ok: true, iso };
}

/** -----------------------------------
 * GET /api/reminders
 * ----------------------------------- */
router.get("/", async (req, res) => {
  try {
    const reminders = await Reminder.find().sort({ createdAt: -1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: "Failed to load reminders" });
  }
});

/** -----------------------------------
 * GET /api/reminders/:id
 * ----------------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ error: "Not found" });
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/** -----------------------------------
 * POST /api/reminders
 * ----------------------------------- */
router.post("/", async (req, res) => {
  try {
    const { month, day, year, time, ...rest } = req.body;

    const built = buildDueAtFromForm({ month, day, year, time });
    if (!built.ok) return res.status(400).json({ error: built.error });

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

/** -----------------------------------
 * PATCH /api/reminders/:id
 * ----------------------------------- */
router.patch("/:id", async (req, res) => {
  try {
    const updates = { ...req.body };

    // If editing the dueAt, convert if necessary
    if (updates.dueAt && !updates.month) {
      updates.dueAt = new Date(updates.dueAt).toISOString();
    }

    const updated = await Reminder.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Reminder not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update reminder" });
  }
});

/** -----------------------------------
 * DELETE /api/reminders/:id
 * ----------------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

module.exports = router;