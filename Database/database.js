const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT,
      middleName TEXT,
      lastName TEXT,
      sex TEXT,
      birthDate TEXT,
      age INTEGER,
      contactNumber TEXT,
      address TEXT,
      studentType TEXT,
      course TEXT,
      yearSection TEXT,
      tupID TEXT,
      password TEXT
    )
  `);
});

module.exports = db;
