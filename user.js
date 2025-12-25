const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    // This is the code for their unique referral link
    referralCode: { type: String, unique: true }, 
    // This links them to the person who invited them
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    // Becomes true once they pay the 150/- registration fee
    isPaid: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
