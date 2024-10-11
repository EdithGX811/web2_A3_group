const mysql = require('mysql');
const dbConfig = require('./db_detail');

const db = mysql.createConnection({
  host: 'localhost',       
  user: 'root',            
  password: '',            
  database: 'crowdfunding_db'  
});

db.connect(err => {
  if (err) {
    return console.error('error: ' + err.message);
  }
  console.log('Connected to the MySQL server.');
});

module.exports = db;


