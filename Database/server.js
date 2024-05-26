const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database'); // Accounts database
const db2 = require('./appointmentsDatabase'); // Appointments database
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, '..')));

// Serve the index.html file by default at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'General', 'index.html'));
});

//-------------------------------ACCOUNT DATABASE FUNCTIONS-------------------------------

//Saves Account Registration
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

// Checks Login Credentials
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


//-------------------------------APPOINTMENTS DATABASE FUNCTIONS-------------------------------

// Appointment Registration
app.post('/bookAppointment', (req, res) => {
  const { firstName, middleName, lastName, studentType, tupID, course, yearSection, requests, date, time } = req.body;
  const sql = `INSERT INTO appointments (firstName, middleName, lastName, studentType, tupID, course, yearSection, requests, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db2.run(sql, [firstName, middleName, lastName, studentType, tupID, course, yearSection, JSON.stringify(requests), date, time], function (err) {
    if (err) {
      return res.status(500).send('Failed to book appointment');
    }
    res.status(200).json({ message: 'Appointment booked successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});