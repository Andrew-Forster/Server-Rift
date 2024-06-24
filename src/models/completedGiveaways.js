const mongoose = require('mongoose');
const { use } = require('../routes/app-routes');

const cgSchema = new mongoose.Schema({
    id: { type: String, required: true },
    prize: { type: String, required: true },
    endTime: { type: Date, required: true },
    winners: { type: Number, required: true },
    winnerNames: { type: Array, required: true },
    winnerIds: { type: Array, required: true },
    channelId: { type: String, required: true },
    guildId: { type: String, required: true },
    guildName: { type: String, required: true },
    message: { type: String, required: true },
    users: { type: Array, required: false }
});

const completedGiveaways = mongoose.model('completedGiveaways', cgSchema);

module.exports = completedGiveaways;