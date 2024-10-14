// Import required modules and objects from Node.js, Express framework, and custom modules.
// This sets up the necessary environment for routing and database interaction.
const express = require('express');
const router = express.Router();
const db = require('../crowdfunding_db');

// Middleware to enable CORS (Cross-Origin Resource Sharing) for all routes in this router.
// This allows requests from any origin and specifies allowed methods and headers.
router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.header('Access-Control-Allow-Methods',"*"); // Allow all methods
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Route to get all active fundraisers, including their categories.
router.get('/fundraisers/active', (req, res) => {
  // SQL query to select active fundraisers and join with categories to get category names.
  const sql = 'SELECT F.*, C.NAME AS CATEGORY_NAME FROM fundraiser F INNER JOIN category C ON F.CATEGORY_ID = C.CATEGORY_ID WHERE F.IS_ACTIVE = 1';
  db.query(sql, (err, result) => {
    if (err) res.status(500).send('Server error'+err); // Send server error response on failure
    res.json(result); // Send JSON response with query result on success
  });
});

// Route to get all categories.
router.get('/categories', (req, res) => {
  const sql = 'SELECT * FROM category'; // SQL query to select all categories
  db.query(sql, (err, result) => {
    if (err) res.status(500).send('Server error'); // Handle error
    console.log(result); // Log result to server console
    res.json(result); // Send JSON response with categories
  });
});

// Route to search active fundraisers based on criteria like city, organizer, etc.
router.get('/fundraisers/search', (req, res) => {
  // Extract search criteria from query parameters.
  const { city, organizer, categoryId, active } = req.query;
  let sql = 'SELECT F.*, C.NAME AS CATEGORY_NAME FROM fundraiser F INNER JOIN category C ON F.CATEGORY_ID = C.CATEGORY_ID ';

  // Dynamically build SQL WHERE clause based on provided search criteria.
  const conditions = [];
  if (city) conditions.push(`F.CITY = '${city}'`);
  if (organizer) conditions.push(`F.ORGANIZER = '${organizer}'`);
  if (categoryId) conditions.push(`F.CATEGORY_ID = ${categoryId}`);
  if (active) conditions.push(`F.IS_ACTIVE = ${active}`);

  // Append conditions to SQL query if any exist.
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  // Execute query and handle response or error.
  db.query(sql, (err, result) => {
    if (err) res.status(500).send('Server error');
    res.json(result); // Send search result as JSON response
  });
});

// Route to get detailed information about a specific fundraiser by ID, including donations.
router.get('/fundraisers/:id', (req, res) => {
  const { id } = req.params; // Extract fundraiser ID from URL parameters
  
  // SQL query to get fundraiser details with category name.
  const sqlFundraiser = `
    SELECT F.*, C.NAME AS CATEGORY_NAME
    FROM fundraiser F
    INNER JOIN category C ON F.CATEGORY_ID = C.CATEGORY_ID
    WHERE F.FUNDRAISE_ID = ?
  `;
  
  // SQL query to get donations made to the specific fundraiser.
  const sqlDonations = `
    SELECT D.DONATION_ID, D.DATE, D.AMOUNT, D.GIVER
    FROM donation D
    WHERE D.FUNDRAISER_ID = ?
  `;

  // First, query for fundraiser details.
  db.query(sqlFundraiser, [id], (err, fundraiserResult) => {
    if (err) {
      res.status(500).send('Server error');
    } else if (fundraiserResult.length > 0) {
      const fundraiser = fundraiserResult[0];

      // Then, query for related donations.
      db.query(sqlDonations, [id], (err, donationsResult) => {
        if (err) {
          res.status(500).send('Server error');
        } else {
          // Respond with both fundraiser details and donations list.
          res.json({
            fundraiser,
            donations: donationsResult
          });
        }
      });
    } else {
      res.status(404).send('Fundraiser not found');
    }
  });
});

// Route to insert a new donation record for a specified fundraiser.
router.post('/fundraisers/:id/donations', (req, res) => {
  const { id } = req.params; // Extract fundraiser ID from URL parameters
  const { amount, giver } = req.body; // Extract donation amount and giver from request body

  // Validate required data presence
  if (!amount || !giver) {
    return res.status(400).send('Amount and giver are required');
  }

  // SQL query to insert new donation record
  const sql = `
    INSERT INTO donation (DATE, AMOUNT, GIVER, FUNDRAISER_ID)
    VALUES (NOW(), ?, ?, ?)
  `;

  // Execute query to insert donation
  db.query(sql, [amount, giver, id], (err, result) => {
    if (err) {
      res.status(500).send({'message':'Server error'});
    } else {
      res.status(201).send({'message':'Donation added successfully'});
    }
  });
});

// Additional routes for inserting, updating, and deleting fundraisers are defined here...

// Export the router to be used in other parts of the application.
module.exports = router;