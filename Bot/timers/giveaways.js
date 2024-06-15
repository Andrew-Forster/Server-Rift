
const path = require('node:path');
const fs = require('node:fs');
const Giveaway = require('../../src/models/giveaway'); // Imports giveaway model from src/models/giveaway.js
const { MessageEmbed } = require('discord.js');

//TODO: Convert to save to database

// Giveaway Timer 

function checkGiveaways(c) {
    setInterval(async () => {
        // console.log('Checking giveaways at ' + new Date().toLocaleTimeString('en-US') + '...');
        const giveaways = await loadGiveaways();
        const now = new Date();
        for (const giveaway of giveaways) {
            if (now >= giveaway.endTime) {
                giveawayComplete(giveaway, c);
            }
        }
    }, 6000);
}

// Giveaway Timer Functions

function saveGiveaway(id, prize, endTime, winners, channelId, guildId, messageId) {
    try {
        Giveaway.create({
            id,
            prize,
            endTime,
            winners,
            channelId,
            guildId,
            message: messageId
        });
    } catch (error) {
        console.log(error);
    }
}

async function loadGiveaways() {
    try {
        return await Giveaway.find();
    } catch (error) {
        return [];
    }
}

async function removeGiveaway(id) {
    try {
        const result = await Giveaway.findOneAndDelete({
            id
        });

        if (!result) {
            console.log('No giveaway found with that ID.');
        }
    } catch (error) {
        console.log(error);
    }
}

async function giveawayComplete (giveaway, client) {
    console.log('Giveaway complete!');
    const channel = giveaway.channelId;
    const message = giveaway.message;
    const winners = giveaway.winners;
    const prize = giveaway.prize;
    const guild = giveaway.guildId;


    const giveawayChannel = client.guilds.cache.get(guild).channels.cache.get(channel);
    const giveawayMessage = await giveawayChannel.messages.fetch(message);
    const reactions = await giveawayMessage.reactions.cache.get('🎉').users.fetch()
    const users = Array.from(reactions.keys()).filter(user => !user.bot);
    const winnersList = [];
    for (let i = 0; i < winners; i++) {
        const winner = users[Math.floor(Math.random() * users.length)];
        if (winner) {
            winnersList.push(`<@${winner}>`);
        }
    }

    if (winnersList.length > 0) {
        const winnerMentions = winnersList.map(winner => winner.toString()).join(' ');
        giveawayChannel.send(`Congratulations ${winnerMentions}! You won **${prize}**!`);
        giveawayMessage.reactions.removeAll();
    } else {
        giveawayChannel.send('No one entered the giveaway, so no one wins!');
    }

    removeGiveaway(giveaway.id);
}

module.exports = {
    checkGiveaways,
    saveGiveaway,
    loadGiveaways,
    removeGiveaway,
    giveawayComplete
}