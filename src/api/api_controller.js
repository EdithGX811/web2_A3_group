// 存放get请求
const express = require('express');
const router = express.Router();
const db = require('./crowdfunding_db');

// 允许跨域请求（CORS）
router.use(function(req, res, next) {
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
router.get('/fundraisers/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT F.*, C.NAME AS CATEGORY_NAME FROM FUNDRAISER F INNER JOIN CATEGORY C ON F.CATEGORY_ID = C.CATEGORY_ID WHERE F.FUNDRAISE_ID = ?';
  db.query(sql, [id], (err, result) => {
    if (err) res.status(500).send('Server error');
    else if (result.length > 0) res.json(result[0]);
    else res.status(404).send('Fundraiser not found');
  });
});

module.exports = router;
