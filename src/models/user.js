const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    discordTemp: { type: String, required: true },
    discordRefresh: { type: String, required: true },
    settings: {
        weeklyRift: { type: Boolean, default: true },
        randomRift: { type: Boolean, default: true },
        serverInterests: { type: Array, default: [] }
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;