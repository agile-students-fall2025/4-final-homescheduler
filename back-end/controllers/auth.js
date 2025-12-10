const express = require('express');
const router = express.Router();
const auth = require('../authentication');
const { User } = require('../db');

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("firstName lastName family email")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const safeUser = {
      name: `${user.firstName} ${user.lastName}`,   // REAL NAME
      family: user.family || null,
      email: user.email                             // optional
    };

    return res.json(safeUser);
  } catch (err) {
    console.error("Error in /api/auth/me:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
