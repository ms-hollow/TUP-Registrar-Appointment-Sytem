const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, '..')));

//app.get('/', (req, res) => {
//  res.sendFile(path.join(__dirname, '../General'));
//});

app.post('/register', (req, res) => {
  const { firstName, middleName, lastName, sex, birthDate, age, contactNumber, address, studentType, course, yearSection, tupID, password } = req.body;
  const sql = `INSERT INTO users (firstName, middleName, lastName, sex, birthDate, age, contactNumber, address, studentType, course, yearSection, tupID, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [firstName, middleName, lastName, sex, birthDate, age, contactNumber, address, studentType, course, yearSection, tupID, password], function (err) {
    if (err) {
      return res.status(500).send('Failed to register user');
    }
    // Redirect to the root URL after successful registration
    res.redirect('../General/index.html');
  });
});

// Login route
app.post('/login', (req, res) => {
    const { tupID, password } = req.body;
  
    console.log('Received login data:', req.body);
    
    const sql = `SELECT password FROM users WHERE tupID = ?`;
  
    db.get(sql, [tupID], (err, row) => {
      if (err) {
        console.error('Server error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }
    
      if (!row) {
        console.log('TUP-ID not registered:', tupID);
        return res.status(401).json({ message: 'TUP-ID is not yet registered' });
      }
    
      if (row.password !== password) {
        console.log('Invalid login credentials:', { tupID, password });
        return res.status(401).json({ message: 'Invalid login credentials. Please check your TUP-ID and password and try again.' });
      }
    
      return res.status(200).json({ message: 'Login successful' });
    });
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});