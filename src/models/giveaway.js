const mongoose = require('mongoose');
const { use } = require('../routes/app-routes');

const giveawaySchema = new mongoose.Schema({
    id: { type: String, required: true },
    prize: { type: String, required: true },
    endTime: { type: Date, required: true },
    winners: { type: Number, required: true },
    channelId: { type: String, required: true },
    guildId: { type: String, required: true },
    message: { type: String, required: true },
    users: { type: Array, required: false }
});

const Giveaway = mongoose.model('Giveaway', giveawaySchema);

module.exports = Giveaway;