const {
	Events
} = require('discord.js');

require('dotenv').config();

const User = require('../../src/models/user');


module.exports = {
    name: Events.GuildMemberRemove,
    once: false,
    async execute(member) {
        try {
            const userId = member.id;
            const guildId = member.guild.id;

            // Find the user in the database
            const user = await User.findOne({ discordId: userId }).exec();
            if (user) {
                // user.stats.serversJoined = user.stats.serversJoined.filter(server => server !== guildId);

                user.stats.serversLeft = user.stats.serversLeft || []; // Ensure the array exists
                if (!user.stats.serversLeft.includes(guildId)) {
                    user.stats.serversLeft.push(guildId);
                }

                await user.save();

                const leaveChannel = member.guild.channels.cache.get(process.env.leaveChannel);
                if (leaveChannel) {
                    await leaveChannel.send(`**${member.user.username}** has left the server: ${member.guild.name}`);
                }
            }
        } catch (err) {
            console.error('Error handling GuildMemberRemove event:', err);
        }
    },
};