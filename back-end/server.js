#!/usr/bin/env node

//const server = require("./app") // load up the web server

//const port = 3000 // the port to listen to for incoming requests

// call express's listen function to start listening to the port
//const listener = server.listen(port, function () {
//  console.log(`Server running on port: ${port}`)
//})

// a function to stop listening to the port
//const close = () => {
 // listener.close()/
//}

//module.exports = {
 // close: close,
//}
const app = require('./app'); // Import the testable app
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
const familyRouter = require('./controllers/createFamilyControl');
app.use('/api/families', familyRouter);