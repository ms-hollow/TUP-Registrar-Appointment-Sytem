const sqlite3 = require('sqlite3').verbose();
const appointmentsDb = new sqlite3.Database('appointments.db');

appointmentsDb.serialize(() => {
  appointmentsDb.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT,
      middleName TEXT,
      lastName TEXT,
      studentType TEXT,
      tupID TEXT,
      course TEXT,
      yearSection TEXT,
      requests TEXT,
      date TEXT,
      time TEXT,
      status TEXT
    )
  `);
  // Add the status column to the existing appointments table
  appointmentsDb.run(`
    ALTER TABLE appointments
    ADD COLUMN transactionNumber TEXT
  `);
});
module.exports = appointmentsDb;
