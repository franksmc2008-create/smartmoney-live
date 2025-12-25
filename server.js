const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./auth');
const User = require('./user');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Your Cloud Database Connection
const dbURI = "mongodb+srv://frankmathaa7_db_user:VTC2N6nujp6sF61N@cluster01.ktjil9d.mongodb.net/SmartMoneyDB?retryWrites=true&w=majority";

mongoose.connect(dbURI)
    .then(() => console.log("Connected to MongoDB Atlas! ✅"))
    .catch(err => console.error("Database Error: ", err));

// --- API: FETCH STATS & AUTO-GENERATE REFERRAL LINKS ---
app.get('/api/user/stats/:phone', async (req, res) => {
    try {
        let user = await User.findOne({ phone: req.params.phone });
        if (!user) return res.status(404).json({ msg: "User not found" });

        // SELF-HEALING: Generate a code if the user doesn't have one yet
        if (!user.referralCode) {
            user.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            await user.save();
        }

        // Count how many people joined using this user's link
        const referralsCount = await User.countDocuments({ referredBy: user._id });

        res.json({
            balance: user.balance,
            referralCode: user.referralCode,
            directReferrals: referralsCount
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- API: ACTIVATION & 60/20/10 COMMISSION LOGIC ---
app.post('/api/activate', async (req, res) => {
    try {
        const { phone } = req.body;
        const user = await User.findOne({ phone });

        if (!user || user.isPaid) return res.status(400).json({ msg: "Invalid activation" });

        user.isPaid = true;
        await user.save();

        // LEVEL 1: Give 60/- to the direct referrer
        let L1 = await User.findById(user.referredBy);
        if (L1) {
            L1.balance += 60;
            await L1.save();
            
            // LEVEL 2: Give 20/- to the person above them
            let L2 = await User.findById(L1.referredBy);
            if (L2) {
                L2.balance += 20;
                await L2.save();
                
                // LEVEL 3: Give 10/- to the top person
                let L3 = await User.findById(L2.referredBy);
                if (L3) {
                    L3.balance += 10;
                    await L3.save();
                }
            }
        }
        res.json({ msg: "Account Activated! Commissions distributed." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.use('/api/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 SmartMoney Engine Live at http://localhost:${PORT}`);
});
