const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Add this line
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());  // Add this line

app.use(express.static('../General'));

app.post('/register', (req, res) => {
    const { firstName, middleName, lastName, sex, birthDate, age, contactNumber, address, studentType, course, yearSection, tupID, password } = req.body;

    const sql = `INSERT INTO users (firstName, middleName, lastName, sex, birthDate, age, contactNumber, address, studentType, course, yearSection, tupID, password)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [firstName, middleName, lastName, sex, birthDate, age, contactNumber, address, studentType, course, yearSection, tupID, password], function (err) {
        if (err) {
            return res.status(500).send('Failed to register user');
        }
        // Redirect to index.html after successful registration
        res.redirect('/index.html');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});