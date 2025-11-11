const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const usersPath = path.join(process.cwd(), 'data', 'users.json');

const readUsers = () => {
  if (!fs.existsSync(usersPath)) return [];
  return JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
};

const writeUsers = (data) => {
  fs.writeFileSync(usersPath, JSON.stringify(data, null, 2));
};

router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields." });
  }

  const users = readUsers();

  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ message: "Email already registered." });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now().toString(),
    email,
    passwordHash,
    name: `${firstName} ${lastName}`,
  };

  users.push(newUser);
  writeUsers(users);

  res.status(201).json({
    message: "Account created successfully!",
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    },
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const users = readUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json({ message: "Email not found." });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(400).json({ message: "Incorrect password." });
  }

  const token = jwt.sign({ id: user.id }, "dev_secret_key");

  res.status(200).json({
    message: "Logged in!",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      token,
    },
  });
});

module.exports = router;
