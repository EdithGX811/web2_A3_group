// Store the get request
const express = require('express');
const router = express.Router();
const db = require('./crowdfunding_db');

// Allow cross-domain requests (CORS)
router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods',"*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Get all active fundraisers, including their category
router.get('/fundraisers/active', (req, res) => {
  const sql = 'SELECT F.*, C.NAME AS CATEGORY_NAME FROM FUNDRAISER F INNER JOIN CATEGORY C ON F.CATEGORY_ID = C.CATEGORY_ID WHERE F.IS_ACTIVE = 1';
  db.query(sql, (err, result) => {
    if (err) res.status(500).send('Server error');
    res.json(result);
  });
});

// Get all categories
router.get('/categories', (req, res) => {
  const sql = 'SELECT * FROM CATEGORY';
  db.query(sql, (err, result) => {
    if (err) res.status(500).send('Server error');
    console.log(result);
    res.json(result);
  });
});

// Search for active fundraisers according to the criteria
router.get('/fundraisers/search', (req, res) => {
  const { city, organizer, categoryId } = req.query;
  let sql = 'SELECT F.*, C.NAME AS CATEGORY_NAME FROM FUNDRAISER F INNER JOIN CATEGORY C ON F.CATEGORY_ID = C.CATEGORY_ID WHERE F.IS_ACTIVE = 1';

  const conditions = [];
  if (city) conditions.push(`F.CITY = '${city}'`);
  if (organizer) conditions.push(`F.ORGANIZER = '${organizer}'`);
  if (categoryId) conditions.push(`F.CATEGORY_ID = ${categoryId}`);

  if (conditions.length > 0) {
    sql += ' AND ' + conditions.join(' AND ');
  }

  db.query(sql, (err, result) => {
    if (err) res.status(500).send('Server error');
    res.json(result);
  });
});

// 获取筹款活动的详细信息（按ID）
// router.get('/fundraisers/:id', (req, res) => {
//   const { id } = req.params;
//   const sql = 'SELECT F.*, C.NAME AS CATEGORY_NAME FROM FUNDRAISER F INNER JOIN CATEGORY C ON F.CATEGORY_ID = C.CATEGORY_ID WHERE F.FUNDRAISE_ID = ?';
//   db.query(sql, [id], (err, result) => {
//     if (err) res.status(500).send('Server error');
//     else if (result.length > 0) res.json(result[0]);
//     else res.status(404).send('Fundraiser not found');
//   });
// });
// Get fundraising details (by ID) including a list of fundraising amounts
router.get('/fundraisers/:id', (req, res) => {
  const { id } = req.params;
  
// Check the list of fundraising events and related donations
  const sqlFundraiser = `
    SELECT F.*, C.NAME AS CATEGORY_NAME
    FROM FUNDRAISER F
    INNER JOIN CATEGORY C ON F.CATEGORY_ID = C.CATEGORY_ID
    WHERE F.FUNDRAISE_ID = ?
  `;
  
  const sqlDonations = `
    SELECT D.DONATION_ID, D.DATE, D.AMOUNT, D.GIVER
    FROM DONATION D
    WHERE D.FUNDRAISER_ID = ?
  `;

  // Check the fundraising details first
  db.query(sqlFundraiser, [id], (err, fundraiserResult) => {
    if (err) {
      res.status(500).send('Server error');
    } else if (fundraiserResult.length > 0) {
      const fundraiser = fundraiserResult[0];

      // Check the list of donations related to the fundraising campaign
      db.query(sqlDonations, [id], (err, donationsResult) => {
        if (err) {
          res.status(500).send('Server error');
        } else {
          // Return to fundraising details and donation list
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
// Insert a new donation record for the designated fundraiser
router.post('/fundraisers/:id/donations', (req, res) => {
  const { id } = req.params;  // Get the FUNDRAISER_ID from the URL
  const { amount, giver } = req.body;  // Get the donation amount and donor information in the request box
  console.log(amount,giver)

  // Verify that the data in the request body is complete
  if (!amount || !giver) {
    return res.status(400).send('Amount and giver are required');
  }

  // Insert a SQL statement for a new donation record
  const sql = `
    INSERT INTO DONATION (DATE, AMOUNT, GIVER, FUNDRAISER_ID)
    VALUES (NOW(), ?, ?, ?)
  `;

  // Perform insert operation
  db.query(sql, [amount, giver, id], (err, result) => {
    if (err) {
      res.status(500).send({'message':'Server error'});
    } else {
      res.status(201).send({'message':'Donation added successfully'});
    }
  });
});

//A new fundraiser is inserted into the database
router.post('/fundraisers', (req, res) => {
  const {
    organizer,
    caption,
    target_fund,
    current_fund,
    city,
    event,
    category_id,
    is_active
  } = req.body;

  // Verify that the required data in the request body is complete
  if (!organizer || !target_fund) {
    return res.status(400).send('Organizer and target fund are required');
  }

  // Insert the SQL statement for the new fundraising campaign
  const sql = `
    INSERT INTO FUNDRAISER (ORGANIZER, CAPTION, TARGET_fund, CURRENT_fund, CITY, EVENT, CATEGORY_ID, IS_ACTIVE)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // When an insert is performed, CURRENT_fund defaults to 0, or 0 is used if not provided in the request body
  const currentFund = current_fund || 0;
  db.query(
    sql,
    [organizer, caption, target_fund, currentFund, city, event, category_id, is_active || 1],
    (err, result) => {
      if (err) {
        res.status(500).send({'message':'Server error'});
      } else {
        res.status(201).send({'message':'Fundraiser created successfully'});
      }
    }
  );
});

//Update existing fundraisers based on the specified id
router.put('/fundraisers/:id', (req, res) => {
  const { id } = req.params;  // Gets the FUNDRAISE_ID in the URL
  const {
    organizer,
    caption,
    target_fund,
    current_fund,
    city,
    event,
    category_id,
    is_active
  } = req.body;

  // Validate the data in the request body
  if (!organizer || !target_fund) {
    return res.status(400).send({'message':'Organizer and target fund are required'});
  }

  // Update the SQL statement for the fundraising campaign
  const sql = `
    UPDATE FUNDRAISER
    SET ORGANIZER = ?, CAPTION = ?, TARGET_fund = ?, CURRENT_fund = ?, CITY = ?, EVENT = ?, CATEGORY_ID = ?, IS_ACTIVE = ?
    WHERE FUNDRAISE_ID = ?
  `;

  // Update
  db.query(
    sql,
    [organizer, caption, target_fund, current_fund || 0, city, event, category_id, is_active || 1, id],
    (err, result) => {
      if (err) {
        res.status(500).send({'message':'Server error'});
      } else if (result.affectedRows === 0) {
        res.status(404).send({'message':'Fundraiser not found'});
      } else {
        res.send({'message':'Fundraiser updated successfully'});
      }
    }
  );
});

//Deletes an existing fundraiser based on the specified id
router.delete('/fundraisers/:id', (req, res) => {
  const { id } = req.params;  // Gets the FUNDRAISE_ID in the URL

  // Delete the SQL statement for the fundraising campaign
  const sql = 'DELETE FROM FUNDRAISER WHERE FUNDRAISE_ID = ?';

  // Perform a delete operation
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).send({'messsage':'Server error'});
    } else if (result.affectedRows === 0) {
      res.status(404).send({'message':'Fundraiser not found'});
    } else {
      res.send({'message':'Fundraiser deleted successfully'});
    }
  });
});




module.exports = router;
