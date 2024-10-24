const express = require("express");
const mysql =require("mysql2");
require('dotenv').config();

   const app = express();
   
//create database connection
   const connection = mysql.createConnection({
    host: process.env.DB_HOST, 
    user: process.env.DB_USERNAME, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME 
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Default GET endpoint
app.get("/", (req, res) => {
    res.send("Welcome to the Hospital Management API! Use /patients to retrieve all patients and /providers to retrieve all providers.");
});

//Question 1

// Retieve all patients

app.get("/patients", function(req, res) {
    const query = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients";

    connection.query(query, (err, results) => { 
        if (err) {
            console.error("Error retrieving patients:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results); 
    });
});


//Question 2
// 2. Retrieve all providers
app.get("/providers", (req, res) => {
    const query = "SELECT first_name, last_name, provider_specialty FROM providers";
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error retrieving providers:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results); 
});

});

// Question 3
// 3. Filter patients by First Name

app.get("/patients/first-name/:firstName", (req, res) => {
    const firstName = req.params.firstName; 
    const query = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?";

    connection.query(query, [firstName], (err, results) => { 
        if (err) {
            console.error("Error retrieving patients:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results); 
    });
});


//question 4
// 4. Retrieve all providers by their specialty

app.get("/providers/specialty/:specialty", (req, res) => {
    const specialty = req.params.specialty.trim(); 
    console.log("Specialty received:", specialty);
    const query = "SELECT first_name, last_name, provider_specialty FROM providers GROUP BY provider_specialty";

    connection.query(query, [specialty], (err, results) => { 
        if (err) {
            console.error("Error retrieving providers:", err);
            return res.status(500).json({ error: "Database query error" });
        }
        res.json(results); 
    });
});


//listen to server
   const PORT = 3000;
   app.listen(PORT, () => {
     console.log(`server is runnig on http://localhost:${PORT}`)
   });


   process.on('SIGINT', () => {
    connection.end((err) => {
        if (err) {
            console.error('Error closing the MySQL connection:', err);
        } else {
            console.log('MySQL connection closed.');
        }
        process.exit();
    });
});