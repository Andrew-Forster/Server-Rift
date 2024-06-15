const mongoose = require('mongoose');

const giveawaySchema = new mongoose.Schema({
    id: { type: String, required: true },
    prize: { type: String, required: true },
    endTime: { type: Date, required: true },
    winners: { type: Number, required: true },
    channelId: { type: String, required: true },
    guildId: { type: String, required: true },
    message: { type: String, required: true }
});

const Giveaway = mongoose.model('Giveaway', giveawaySchema);

module.exports = Giveaway;