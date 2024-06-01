const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    serverId: { type: String, required: true },
    serverName: { type: String, required: true },
    serverOwner: { type: String, required: true },
    niche: { type: Array, required: true },
    usersAdded: { type: Number, default: 0 },

});

const Server = mongoose.model('Server', serverSchema);

module.exports = Server;