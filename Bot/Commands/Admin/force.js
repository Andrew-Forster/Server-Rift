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
        .setName('force')
        .setDescription('Adds users to a specified server.')
        .addStringOption(option =>
            option.setName('server_id')
            .setDescription('ID of the server to add users to')
            .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('num_users')
            .setDescription('Number of users to add')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('niche')
            .setDescription('Niche for the added users (Default: all)')
            .setRequired(false)
            .addChoices({
                name: 'Minecraft',
                value: 'Minecraft'
            }, {
                name: 'Fortnite',
                value: 'Fortnite'
            }, {
                name: 'Roblox',
                value: 'Roblox'
            }, {
                name: 'Music',
                value: 'Music'
            }, {
                name: 'Meme',
                value: 'Meme'
            }, {
                name: 'Anime',
                value: 'Anime'
            }, {
                name: 'Social',
                value: 'Social'
            }, {
                name: 'Giveaway',
                value: 'Giveaway'
            }, {
                name: 'All',
                value: 'all'
            })
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

        // Check if amount of users can be added
        let numUsers = interaction.options.getInteger('num_users');
        let dbUsers = await User.countDocuments({
            'stats.serversJoined': {
                $nin: [guildId]
            }
        });

        // Check if amount of users can be added in niche
        let niche = interaction.options.getString('niche') || 'all';
        switch (niche) {
            case 'all':
                break;
            default:
                dbUsers = await User.countDocuments({
                    'settings.serverInterests': `${niche}`,
                    'stats.serversJoined': {
                        $nin: [guildId]
                    }
                });
                break;
        }

        if (numUsers > dbUsers) {
            return interaction.editReply(`The database only contains ${dbUsers} users that have not joined that server. Along with the niche: \`${niche}\`.`);
        }
        interaction.editReply(`Adding users to the server ${guildName}...`);
        try {
            let query = {};

            if (niche !== 'all') {
                query = {
                    'settings.serverInterests': niche
                }; 
            }
            let users = await User.find(query)
            .sort({
                'stats.ServersJoinedCount': 1
            })
            .limit(numUsers);
            
            let usersArr = [];
            for (const user of users) {
                if (interaction.client.guilds.cache.get(guildId).members.cache.has(user.discordId)) {
                    continue;
                }
                try {

                    const res = await fetch(`https://discord.com/api/guilds/${guildId}/members/${user.discordId}`, {
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
                    if (user.settings.joinNotif === true) {
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
        
                    const logChannel = process.env.joinChannel;
                    const channel = await guild.channels.fetch(logChannel);
                    await channel.send(`User ${user.username} has been added to the server ${guildName}`);

                    usersArr.push(user.discordId + ': ' + user.username);
                } catch (error) {
                    console.error(error);
                }
            }
        
            return interaction.editReply(`Added ${usersArr.length} users to the server ${guildName}`);
        } catch (error) {
            console.error(error);
            return interaction.reply('An error occurred while adding users to the server.');
        }

    },
};