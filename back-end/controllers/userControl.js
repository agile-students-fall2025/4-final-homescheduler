const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../db');   
const auth = require('../authentication');

const router = express.Router();

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: passwordHash
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    res.status(201).json({
      message: "Account created successfully!",
      user: {
        id: newUser._id,
        email: newUser.email,
        name: `${newUser.firstName} ${newUser.lastName}`,
        token,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during signup." });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password, remember } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password." });

      const expiresIn = remember ? "30d" : "2h";

      const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    res.status(200).json({
      message: "Logged in!",
      user: {
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        token,
      },
    });
});

router.get('/me', auth, (req, res) => {
  res.json({
    message: "Protected route accessed!",
    user: req.user
  });
});

module.exports = router;
