// import and instantiate express
const express = require("express") // CommonJS import style!
const cors = require('cors'); // We'll need this to let React talk to the server

const remindersRouter = require('./routes/reminders'); // <-- add this


const app = express() // instantiate an Express object
const PORT = 3001; 

app.use(cors());


app.use(express.json());


app.use("/api/reminders", remindersRouter);
module.exports = app;

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });