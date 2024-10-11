const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 3000;

// The api_controller module is introduced
const apiRoutes = require('./api_controller');

// Set static file directory
app.use(express.static('client'));

// Using API routing
app.use('/api', apiRoutes);

// Startup server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
