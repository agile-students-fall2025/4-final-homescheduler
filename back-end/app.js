const express = require('express');
const cors = require('cors'); // We'll need this to let React talk to the server

//import routers
const eventRoutes = require('./controllers/calender');

const app = express();
const PORT = 3001; 


app.use(cors());

app.use(express.json());

// Routers
app.use('/api/events', eventRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});