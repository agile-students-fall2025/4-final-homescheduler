// import and instantiate express
const express = require("express") // CommonJS import style!
const app = express() // instantiate an Express object

// we will put some server logic here later...

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const remindersRouter = require("./routes/reminders");
app.use("/api/reminders", remindersRouter);

app.get("/", (req, res) => {
  res.send("Hello World!")
})
// export the express app we created to make it available to other modules
module.exports = app