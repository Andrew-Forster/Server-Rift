const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    EmbedBuilder
} = require('discord.js');
const path = require('path');
require('discord.js');
require('dotenv').config();

const giveaways = require('../../timers/giveaways.js');


module.exports = {
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('react-giveaway')
        .setDescription('Starts a giveaway in the current server.')
        .addStringOption(option =>
            option.setName('prize')
            .setDescription('The prize for the giveaway.')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('duration')
            .setDescription('The duration of the giveaway.')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('channel_id') 
            .setDescription('The channel to start the giveaway in.')
            .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName('winners')
            .setDescription('The number of winners for the giveaway.')
            .setRequired(false)
        ),
    async execute(interaction) {

        if (!process.env.adminUsers.includes(interaction.user.id)) {
            return interaction.editReply('Sorry, you do not have permission to use this command.');
        }
        
        const prize = interaction.options.getString('prize');
        const duration = parseDur(interaction.options.getString('duration'));
        const channel = interaction.options.getString('channel_id') || interaction.channel.id;
        const winners = interaction.options.getInteger('winners') || 1;

        const endTime = new Date(Date.now() + duration);

        if (duration < 1000) {
            return interaction.reply('The duration of the giveaway must be at least 1 minute.');
        }

        if (winners < 1) {
            return interaction.reply('The number of winners must be at least 1.');
        }

        const giveawayChannel = interaction.guild.channels.cache.find(ch => ch.id === channel) || null;
        if (!giveawayChannel) {
            return interaction.reply('I could not find that channel.');
        }

        const giveawayEmbed = new EmbedBuilder()
            .setTitle('🎉 Giveaway 🎉')
            .setDescription(`React with 🎉 to enter the giveaway!\nPrize: **${prize}**\nWinners: **${winners}**` + `\n\nEnds at ${formatDate(endTime)}`)
            .setFooter({
                text: 'Giveaway hosted by Server Rift, Learn more at serverrift.com',
                iconURL: 'https://andrew-forster.github.io/Images/logofull.png'
            })
            .setColor('#3a7ce5');

        const message = await giveawayChannel.send({
            embeds: [giveawayEmbed]
        });
        message.react('🎉');
        // Todo: Change giveaway server to the server the giveaway is in
        giveaways.saveGiveaway(prize, endTime, winners, giveawayChannel.id, interaction.guild.id, interaction.guild.name, message.id);

        interaction.reply('The giveaway has been started in the server: ' + interaction.guild.name + ' in the channel: ' + giveawayChannel.name);

        // Reaction Collector to respond to users entering

        const filter = (reaction, user) => reaction.emoji.name === '🎉' && !user.bot;
        const collector = message.createReactionCollector({
            filter,
            time: duration
        });

        collector.on('collect', async (reaction, user) => {
            giveawayChannel.send(`You have entered the giveaway for **${prize}**!`);
        });
    }

}

function parseDur(dur) {
    const match = dur.match(/^(\d+)([smhd])$/);
    if (!match && isNaN(dur)) return NaN;


    let str;
    let num;
    let numDur = 0;
    if (match) {
        [, num, str] = match;
        numDur = parseInt(num);
    } else {
        numDur = parseInt(dur);
    }

    switch (str) {
        case 's':
            return numDur * 1000;
        case 'm':
            return numDur * 60000;
        case 'h':
            return numDur * 3600000;
        case 'd':
            return numDur * 86400000;
        default:
            return numDur * 60000;
    }
}

function formatDate(date) {
    const unixTime = Math.floor(date.getTime() / 1000);
    return `<t:${unixTime}:f>`;
}