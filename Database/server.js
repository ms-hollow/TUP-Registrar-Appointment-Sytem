const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../General/index.html'));
});

app.post('/register', (req, res) => {
  const { firstName, middleName, lastName, sex, birthDate, age, contactNumber, address, studentType, course, yearSection, tupID, password } = req.body;
  const sql = `INSERT INTO users (firstName, middleName, lastName, sex, birthDate, age, contactNumber, address, studentType, course, yearSection, tupID, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [firstName, middleName, lastName, sex, birthDate, age, contactNumber, address, studentType, course, yearSection, tupID, password], function (err) {
    if (err) {
      return res.status(500).send('Failed to register user');
    }
    // Redirect to the root URL after successful registration
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});