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
      
      return res.status(200).json({ tupID: tupID, password: password, message: 'Login successful' }); 
    });
  });

// Retrieve Profile
app.get('/profile', (req, res) => {
  const { tupID } = req.query; // Retrieve TUP ID from query parameters
  
  if (!tupID) {
      return res.status(400).json({ message: 'TUP ID is missing in the request.' });
  }

  const sql = `SELECT * FROM users WHERE tupID = ?`;

  db.get(sql, [tupID], (err, row) => {
      if (err) {
          console.error('Failed to fetch profile:', err);
          return res.status(500).json({ message: 'Failed to fetch profile' });
      }

      if (!row) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(row);
  });
});

// Update Profile Student
app.post('/updateProfile', (req, res) => {
  const { firstName, middleName, lastName, sex, birthDate, age, contactNumber, address, studentType, course, yearSection, tupID } = req.body;
  const sql = `UPDATE users 
               SET firstName = ?, middleName = ?, lastName = ?, sex = ?, birthDate = ?, age = ?, contactNumber = ?, address = ?, studentType = ?, course = ?, yearSection = ?
               WHERE tupID = ?`;

  db.run(sql, [firstName, middleName, lastName, sex, birthDate, age, contactNumber, address, studentType, course, yearSection, tupID], function (err) {
    if (err) {
      return res.status(500).send('Failed to update profile');
    }
    res.status(200).json({ message: 'Profile updated successfully' });
  });
});

// Change Password
app.post('/changePassword', (req, res) => {
  const { tupID, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'New password and confirm password do not match' });
  }

  const sql = `UPDATE users SET password = ? WHERE tupID = ?`;

  db.run(sql, [newPassword, tupID], function (err) {
    if (err) {
      console.error('Failed to update password:', err);
      return res.status(500).json({ message: 'Failed to update password' });
    }
    res.status(200).json({ message: 'Password changed successfully' });
  });
});

// Update Profile Admin
app.post('/updateProfileAdmin', (req, res) => {
  const { school, admincadminContactnum, adminAdress, tupID } = req.body;
  const sql = `UPDATE users 
               SET school = ?, admincadminContactnum = ?, adminAdress = ?
               WHERE tupID = ?`;

  db.run(sql, [school, admincadminContactnum, adminAdress, tupID], function (err) {
    if (err) {
      return res.status(500).send('Failed to update profile');
    }
    res.status(200).json({ message: 'Profile updated successfully' });
  });
});

//-------------------------------APPOINTMENTS DATABASE FUNCTIONS-------------------------------
// Appointment Registration
app.post('/bookAppointment', (req, res) => {
  // Extract appointment data from the request body
  const { firstName, middleName, lastName, studentType, tupID, course, yearSection, requests, date, time, status = 'Pending', transactionNumber } = req.body;

  // Prepare the document requests data for insertion
  const documentRequestsData = JSON.stringify(requests);

  // Insert the appointment data into the appointments database
  const sql = `INSERT INTO appointments (firstName, middleName, lastName, studentType, tupID, course, yearSection, requests, date, time, status, transactionNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db2.run(sql, [firstName, middleName, lastName, studentType, tupID, course, yearSection, documentRequestsData, date, time, status, transactionNumber], function (err) {
    if (err) {
      console.error('Failed to book appointment:', err);
      return res.status(500).json({ message: 'Failed to book appointment' });
    }
    console.log('Appointment booked successfully');
    res.status(200).json({ message: 'Appointment booked successfully' });
  });
});

// Retrieve Appointments by TUP ID
app.get('/appointments/:tupID', (req, res) => {
  const { tupID } = req.params;
  const sql = `SELECT * FROM appointments WHERE tupID = ?`;
  
  db2.all(sql, [tupID], (err, rows) => {
    if (err) {
      console.error('Failed to fetch appointments:', err);
      return res.status(500).json({ message: 'Failed to fetch appointments' });
    }
    // Send the retrieved appointments data as response
    res.status(200).json(rows);
  });
});

// Retrieve All Appointments
app.get('/appointments', (req, res) => {
  const sql = 'SELECT * FROM appointments';

  db2.all(sql, (err, rows) => {
    if (err) {
      console.error('Failed to fetch appointments:', err);
      return res.status(500).json({ message: 'Failed to fetch appointments' });
    }
    // Send the retrieved appointments data as response
    res.status(200).json(rows);
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});