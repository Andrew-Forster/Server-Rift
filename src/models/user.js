const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    discordId: { type: String, required: false },
    username: { type: String, required: false },
    discordAccess: { type: String, required: true },
    discordRefresh: { type: String, required: true },
    date: { type: Date, default: Date.now },
    stats: {
        serversJoined: { type: Array, default: [] },
        serversLeft: { type: Array, default: [] },
        activityLevel: { type: Number, default: 0 },
        activityRank: { type: Number, default: 0 },
    },
    settings: {
        weeklyRift: { type: Boolean, default: true },
        randomRift: { type: Boolean, default: true },
        joinNotif: { type: Boolean, default: true },
        updateNotif: { type: Boolean, default: false },
        serverInterests: { type: Array, default: [] }
    },
    session: { type: String, required: true }, // Identifier for the user for backend processes
});

userSchema.virtual('stats.serversJoinedCount').get(function () {
    return this.stats.serversJoined.length;
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', userSchema);

module.exports = User; 