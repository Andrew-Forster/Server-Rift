const {
    SlashCommandBuilder
} = require('@discordjs/builders');
require('discord.js');

require('dotenv').config();


const mongoose = require('mongoose');
const User = require('../../../src/models/user'); // Import your User model
const dbConnection = require('../../../server.js'); // Import the exported connection from server.js

module.exports = {
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('single')
        .setDescription('Adds users to a specified server.')
        .addStringOption(option =>
            option.setName('server_id')
            .setDescription('ID of the server to add users to')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('user_id')
            .setDescription('Number of users to add')
            .setRequired(true)
        )
        .addBooleanOption(option =>
            option.setName('silence')
            .setDescription('Whether to silence the join notification if enabled')
        ),

    async execute(interaction) {
        await interaction.deferReply();
        if (!process.env.adminUsers.includes(interaction.user.id)) {
            return interaction.editReply('Sorry, you do not have permission to use this command.');
        }

        const guildId = interaction.options.getString('server_id');
        const guild = interaction.guild;
        const member = await guild.members.fetch(interaction.user.id);

        if (!interaction.client.guilds.cache.has(guildId)) {
            return interaction.editReply('The bot is not in that server or that server does not exist.');
        }
        const guildName = interaction.client.guilds.cache.get(guildId).name;

        if (!member.permissions.has('FLAGS.CREATE_INSTANT_INVITE')) {
            return interaction.editReply('The bot does not have the necessary permissions to create invites in that server.');
        }

        // Check if user is in the server
        const userId = interaction.options.getString('user_id');
        let user = await User.findOne({
            discordId: userId
        });

        if (interaction.client.guilds.cache.get(guildId).members.cache.has(userId)) {
            return interaction.editReply(`User ${user.username} is already in the server ${guildName}`);
        }

        if (user == null) {
            return interaction.editReply(`The database does not contain the user with the id of: \`${userId}\``);
        }
        interaction.editReply(`Adding ${user.username} to the server ${guildName}...`);
        try {
            const res = await fetch(`https://discord.com/api/guilds/${guildId}/members/${userId}`, {
                method: 'PUT',
                headers: {
                    "Authorization": `Bot ${process.env.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    access_token: user.discordAccess,
                    roles: []
                })
            });

            if (!res.ok) {
                throw new Error('Failed to add user to server:' + res.statusText);
            }
            if (user.settings.joinNotif === true && !interaction.options.getBoolean('silence')) {
                try {
                    const member = await guild.members.fetch(user.discordId);
                    await member.send(`You have been added to the server ${guildName}!`);
                } catch (error) {
                    const errorChannel = await guild.channels.fetch(process.env.errorChannel);
                    errorChannel.send(`Failed to send message to user ${user.username} (${user.discordId}): User likely has DMs disabled or has blocked the bot. Error: ${error}`);
                }
            }
            user.stats.serversJoined.push(guildId);
            await user.save();

            interaction.editReply(`Added ${user.username} users to the server ${guildName}`);
        } catch (error) {
            console.error(error);
            return interaction.reply('An error occurred while adding users to the server.');
        }
        const logChannel = process.env.joinChannel;
        const channel = await guild.channels.fetch(logChannel);
        await channel.send(`User ${user.username} has been added to the server ${guildName}`);
    },
};