const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    GuildMember,
    Permissions
} = require('discord.js');

require('dotenv').config();

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
        ),

    async execute(interaction) {

        if (!process.env.adminUsers.includes(interaction.user.id)) {
            return interaction.reply('Sorry, you do not have permission to use this command.');
        }

        if (!guild.me.permissions.has(Permissions.FLAGS.CREATE_INSTANT_INVITE)) {
            return interaction.reply('The bot does not have the necessary permissions to create invites in that server.');
        }

        // Create an invite link
        const invite = await guild.channels.create('force-add', {
            type: 'GUILD_TEXT'
        }).then(channel => channel.createInvite({
            temporary: false
        }));

        // Generate a list of fake users to add
        const usersToAdd = [];
        for (let i = 0; i < numUsers; i++) {
            const fakeUser = await guild.members.create({
                user: {
                    username: `FakeUser${i + 1}`,
                    discriminator: '0000',
                },
                nick: `${niche}-User${i + 1}`,
            });
            usersToAdd.push(fakeUser);
        }

        // Add the users to the server
        usersToAdd.forEach(async user => {
            try {
                await user.send(`You've been added to the server with the niche: ${niche}. Here's your invite link: ${invite.url}`);
            } catch (error) {
                console.error(`Failed to send DM to ${user.user.tag}: ${error}`);
            }
        });

        return interaction.reply(`Successfully added ${numUsers} users to the server with the niche: ${niche}. Invite link: ${invite.url}`);

    },
};