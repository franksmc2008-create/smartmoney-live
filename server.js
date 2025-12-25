require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios'); // For M-Pesa API calls
const app = express();

// 1. SETTINGS & MIDDLEWARE
const PORT = process.env.PORT || 8080; // Koyeb uses 8080 by default
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// This line tells the server to share your CSS, Images, and HTML
app.use(express.static(__dirname));

// 2. THE ROUTES (Navigation)

// Serve the Homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Placeholder for Login
app.get('/login', (req, res) => {
    res.send('Login Page Coming Soon - Use GitHub to add login.html!');
});

// 3. M-PESA LOGIC (The Money Part)

// Route to trigger M-Pesa STK Push
app.post('/stkpush', async (req, res) => {
    console.log("M-Pesa payment requested...");
    // We will add your Daraja API logic here once we link Koyeb!
    res.json({ message: "STK Push Initiated. Check your phone!" });
});

// Route for M-Pesa to tell us if payment was successful
app.post('/callback', (req, res) => {
    const data = req.body;
    console.log("M-Pesa Callback Received:", data);
    res.status(200).send("Callback Received");
});

// 4. START THE ENGINE
app.listen(PORT, () => {
    console.log(`🚀 SmartMoney is live on port ${PORT}`);
    console.log(`Link: http://localhost:${PORT} (Local) or your Koyeb URL (Live)`);
});
