const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    isActivated: { type: Boolean, default: false }, // Becomes true after M-Pesa payment
    referralCode: { type: String, unique: true, default: () => Math.random().toString(36).substring(2, 8) },
    dateJoined: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
