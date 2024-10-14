// Import the express module to create a web application
const express = require('express');
// Initialize the express application
const app = express();

// Middleware to parse JSON bodies. This will allow us to access request bodies in JSON format.
app.use(express.json());
// Middleware to parse URL-encoded bodies. This is useful for handling form submissions.
app.use(express.urlencoded({ extended: true }));

// Define the port number on which the server will listen for requests
const port = 3000;

// Import the API routes module from the 'controllerAPI' directory.
// This module is expected to export an Express router with defined routes.
const apiRoutes = require('./controllerAPI/api_controller');

// Middleware to serve static files from the 'client' directory.
// This allows you to serve any HTML, CSS, or client-side JavaScript files.
app.use(express.static('client'));

// Use the imported API routes with the base path '/api'.
// This means all routes defined in the apiRoutes router will be prefixed with '/api'.
app.use('/api', apiRoutes);

// Start the server and listen on the defined port.
// When the server starts successfully, it logs a message with the URL where it's listening.
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});