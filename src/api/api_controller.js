// 存放get请求
const express = require('express');
const router = express.Router();
const db = require('./crowdfunding_db');

// 允许跨域请求（CORS）
router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// 获取所有活跃的筹款者，包括他们的类别
router.get('/fundraisers/active', (req, res) => {
  const sql = 'SELECT F.*, C.NAME AS CATEGORY_NAME FROM FUNDRAISER F INNER JOIN CATEGORY C ON F.CATEGORY_ID = C.CATEGORY_ID WHERE F.IS_ACTIVE = 1';
  db.query(sql, (err, result) => {
    if (err) res.status(500).send('Server error');
    res.json(result);
  });
});

// 获取所有类别
router.get('/categories', (req, res) => {
  const sql = 'SELECT * FROM CATEGORY';
  db.query(sql, (err, result) => {
    if (err) res.status(500).send('Server error');
    console.log(result);
    res.json(result);
  });
});

// 根据条件检索活跃的筹款者
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
//获取筹款活动的详细信息（按ID）包括筹款金额列表
router.get('/fundraisers/:id', (req, res) => {
  const { id } = req.params;
  
  // 查询筹款活动和相关的捐款列表
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

  // 先查询筹款活动详情
  db.query(sqlFundraiser, [id], (err, fundraiserResult) => {
    if (err) {
      res.status(500).send('Server error');
    } else if (fundraiserResult.length > 0) {
      const fundraiser = fundraiserResult[0];

      // 查询该筹款活动相关的捐款列表
      db.query(sqlDonations, [id], (err, donationsResult) => {
        if (err) {
          res.status(500).send('Server error');
        } else {
          // 返回筹款活动详情和捐款列表
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
//为指定的筹款人插入新的捐款记录
router.post('/fundraisers/:id/donations', (req, res) => {
  const { id } = req.params;  // 获取URL中的FUNDRAISER_ID
  const { amount, giver } = req.body;  // 获取请求体中的捐款金额和捐款人信息
  console.log(amount,giver)

  // 验证请求体中的数据是否齐全
  if (!amount || !giver) {
    return res.status(400).send('Amount and giver are required');
  }

  // 插入新的捐款记录的SQL语句
  const sql = `
    INSERT INTO DONATION (DATE, AMOUNT, GIVER, FUNDRAISER_ID)
    VALUES (NOW(), ?, ?, ?)
  `;

  // 执行插入操作
  db.query(sql, [amount, giver, id], (err, result) => {
    if (err) {
      res.status(500).send({'message':'Server error'});
    } else {
      res.status(201).send({'message':'Donation added successfully'});
    }
  });
});

//新的筹款人插入数据库
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

  // 验证请求体中的必填数据是否齐全
  if (!organizer || !target_fund) {
    return res.status(400).send('Organizer and target fund are required');
  }

  // 插入新的筹款活动的SQL语句
  const sql = `
    INSERT INTO FUNDRAISER (ORGANIZER, CAPTION, TARGET_fund, CURRENT_fund, CITY, EVENT, CATEGORY_ID, IS_ACTIVE)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // 执行插入操作，CURRENT_fund 默认为 0，如果请求体未提供，则使用0
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

//根据指定id更新现有筹款人
router.put('/fundraisers/:id', (req, res) => {
  const { id } = req.params;  // 获取 URL 中的 FUNDRAISE_ID
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

  // 验证请求体中的数据
  if (!organizer || !target_fund) {
    return res.status(400).send('Organizer and target fund are required');
  }

  // 更新筹款活动的 SQL 语句
  const sql = `
    UPDATE FUNDRAISER
    SET ORGANIZER = ?, CAPTION = ?, TARGET_fund = ?, CURRENT_fund = ?, CITY = ?, EVENT = ?, CATEGORY_ID = ?, IS_ACTIVE = ?
    WHERE FUNDRAISE_ID = ?
  `;

  // 执行更新操作
  db.query(
    sql,
    [organizer, caption, target_fund, current_fund || 0, city, event, category_id, is_active || 1, id],
    (err, result) => {
      if (err) {
        res.status(500).send('Server error');
      } else if (result.affectedRows === 0) {
        res.status(404).send('Fundraiser not found');
      } else {
        res.send('Fundraiser updated successfully');
      }
    }
  );
});

//根据指定id删除现有筹款人
router.delete('/fundraisers/:id', (req, res) => {
  const { id } = req.params;  // 获取URL中的FUNDRAISE_ID

  // 删除筹款活动的SQL语句
  const sql = 'DELETE FROM FUNDRAISER WHERE FUNDRAISE_ID = ?';

  // 执行删除操作
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).send('Server error');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Fundraiser not found');
    } else {
      res.send('Fundraiser deleted successfully');
    }
  });
});




module.exports = router;
