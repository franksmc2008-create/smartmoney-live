const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('./user');

// --- REGISTRATION ROUTE ---
router.post('/register', async (req, res) => {
    try {
        const { phone, password, referredByCode } = req.body;

        // Check if user exists
        let user = await User.findOne({ phone });
        if (user) return res.status(400).json({ msg: "User already exists" });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Find who referred them (optional)
        let referrer = null;
        if (referredByCode) {
            referrer = await User.findOne({ referralCode: referredByCode });
        }

        // Create new user
        const newUser = new User({
            phone,
            password: hashedPassword,
            referredBy: referrer ? referrer._id : null,
            referralCode: Math.random().toString(36).substring(2, 8).toUpperCase()
        });

        await newUser.save();
        res.json({ msg: "Registration successful" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;

        // 1. Find user by phone
        const user = await User.findOne({ phone });
        if (!user) return res.status(400).json({ msg: "User not found" });

        // 2. Compare the password with the hashed version in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        // 3. If everything is correct
        res.json({ msg: "Login successful", phone: user.phone });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
