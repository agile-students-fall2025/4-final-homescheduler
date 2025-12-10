const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose'); // Import mongoose here
const path = require('path');
require('dotenv').config(); // Load env variables

// Import Routers
const userRoutes = require('./controllers/userControl');
const eventRoutes = require('./controllers/calender');
const CalRoutes = require("./controllers/calenderDB");
const reminderRoutes = require('./controllers/reminders');
const passwordRoutes = require('./controllers/passwordControl');
const familyRoutes = require('./controllers/createFamilyControl');

const app = express();
const PORT = 3001; 

// Middleware
app.use(cors());
app.use(express.json());

// --- Database Connection (Happens here) ---
const connectToDb = async () => {
  try {
    // Make sure process.env.MONGO_URI is defined in your .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB Connection failed:', error);
    process.exit(1); // Stop the app if DB fails
  }
};
connectToDb();

// --- Routes ---
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes); 
app.use('/api/reminders', reminderRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/password', passwordRoutes)
app.use('/api/auth', require('./controllers/auth'));
app.use('/api/calendar', CalRoutes); 

app.use(express.static(path.join(__dirname, '../front-end/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front-end/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;