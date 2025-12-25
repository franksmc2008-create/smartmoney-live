require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./auth'); // Connects our login/register logic

const app = express();
const PORT = process.env.PORT || 8080;

// 1. DATABASE CONNECTION
// We will put the actual link in Koyeb later for security
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to SmartMoney Database"))
    .catch(err => console.error("❌ Database Connection Error:", err));

// 2. MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// 3. ROUTES
app.use('/', authRoutes); // This activates your Register/Login buttons

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// M-Pesa Placeholder
app.post('/stkpush', (req, res) => {
    res.send("<h1>Payment Page</h1><p>M-Pesa STK Push will trigger here once we link Daraja.</p>");
});

// 4. START SERVER
app.listen(PORT, () => {
    console.log(`🚀 SmartMoney Engine Running on Port ${PORT}`);
});
