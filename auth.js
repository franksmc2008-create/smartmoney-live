const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('./user'); // This connects to our database model

// 1. REGISTRATION LOGIC
router.post('/register', async (req, res) => {
    try {
        const { fullName, phone, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ phone });
        if (user) {
            return res.status(400).send('Error: This phone number is already registered.');
        }

        // Hash the password (Security)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user (Not activated yet)
        user = new User({
            fullName,
            phone,
            password: hashedPassword,
            isActivated: false,
            balance: 0
        });

        await user.save();

        // Success! Now we trigger the M-Pesa Payment
        console.log(`New user created: ${fullName}. Waiting for payment...`);
        res.redirect('/stkpush'); // This sends them to the payment trigger

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).send('Server error. Please try again later.');
    }
});

// 2. LOGIN LOGIC
router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Find user by phone
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(400).send('Error: Invalid Phone or Password');
        }

        // Check if password matches the scrambled version in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Error: Invalid Phone or Password');
        }

        // If successful, send them to their dashboard
        res.send(`Welcome back, ${user.fullName}! Redirecting to your dashboard...`);

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send('Server error.');
    }
});

module.exports = router;
