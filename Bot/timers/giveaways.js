const path = require('node:path');
const fs = require('node:fs');
const Giveaway = require('../../src/models/giveaway'); // Imports giveaway model from src/models/giveaway.js
const {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} = require('discord.js');
const uuid = require('uuid');
const User = require('../../src/models/user');
const cgs = require('../../src/models/completedGiveaways');

const domain = process.env.DOMAIN;

// Giveaway Timer 

//TODO: As giveaway approaches end time, make checks more frequent
async function checkGiveaways(c) {
    setInterval(async () => {
        // console.log('Checking giveaways at ' + new Date().toLocaleTimeString('en-US') + '...');
        const giveaways = await loadGiveaways();
        const now = new Date();
        for (const giveaway of giveaways) {
            if (now >= giveaway.endTime) {
                giveawayComplete(giveaway, c);
            }
        }
    }, 10000);
 
    // Listen to each giveaway message for button interactions

    const giveaways = await loadGiveaways();
    for (const giveaway of giveaways) {
        const channel = c.guilds.cache.get(giveaway.guildId).channels.cache.get(giveaway.channelId);
        const message = await channel.messages.fetch(giveaway.message); 
        collect(message, giveaway.endTime - new Date(), giveaway.prize);
    }


}

function genUUID() {
    return uuid.v4();

}


// Giveaway Timer Functions

function saveGiveaway(id, prize, endTime, winners, channelId, guildId, guildName, messageId) {
    try {
        Giveaway.create({
            id,
            prize,
            endTime,
            winners,
            channelId,
            guildId,
            guildName,
            message: messageId
        });
    } catch (error) {
        console.log(error);
    }
    return id;
}

async function addGiveawayUser(id, user) {
    try {
        const giveaway = await Giveaway.findOne({
            message: id
        });
        if (giveaway) {
            giveaway.users.push(user);
            giveaway.save();
        }
    } catch (error) {
        console.log(error);
    }
}

async function removeGiveawayUser(id, user) {
    try {
        const giveaway = await Giveaway.findOne({
            message: id
        });
        if (giveaway) {
            const index = giveaway.users.indexOf(user);
            if (index > -1) {
                giveaway.users.splice(index, 1);
                giveaway.save();
            }
        }
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

// Removes the giveaway from the database & saves it to the completed giveaways database
async function removeGiveaway(id, winnerNames, winnerIds) {
    try {
        const result = await Giveaway.findOne({
            id
        });

        await cgs.create({
            id: result.id,
            prize: result.prize,
            endTime: result.endTime,
            winners: result.winners,
            winnerNames,
            winnerIds,
            channelId: result.channelId,
            guildId: result.guildId,
            guildName: result.guildName,
            message: result.message,
            users: result.users
        });

        if (result) {
            await Giveaway.findOneAndDelete({
                id
            });
        } else {
            console.log('No giveaway found with that ID.');
        }
    } catch (error) {
        console.log(error);
    }
}

async function getGiveawayUsers(id) {
    try {
        const giveaway = await Giveaway.findOne({
            message: id
        });

        if (giveaway) {
            return giveaway.users;
        }


    } catch {
        console.log(error);
        return [];
    }
}

async function giveawayComplete(giveaway, client) {
    console.log('Giveaway complete!');
    const id = giveaway.id;
    const channel = giveaway.channelId;
    const message = giveaway.message;
    const winners = giveaway.winners;
    const prize = giveaway.prize;
    const guild = giveaway.guildId;

    const giveawayGuild = client.guilds.cache.get(guild);
    const giveawayChannel = giveawayGuild.channels.cache.get(channel);
    const giveawayMessage = await giveawayChannel.messages.fetch(message);
    const users = await getGiveawayUsers(giveaway.message);
    const winnersList = [];
    const winnerIds = [];
    const winnerNames = [];
    for (let i = 0; i < winners; i++) {
        const winner = users[Math.floor(Math.random() * users.length)];
        if (winner) {
             try {
                const user = await client.users.fetch(winner);
                if (i === winners - 2) {
                    winnersList.push(`<@${winner}> and`);
                } else {
                    winnersList.push(`<@${winner}>`);
                }
                winnerIds.push(winner);
                winnerNames.push(user.username);
            } catch (error) {
                console.error(`Error fetching user with ID ${winner}:`, error);
            }
        }
    }
    let edit;
    if (winnersList.length > 0) {
        const winnerMentions = winnersList.map(winner => winner.toString()).join(' ');
        giveawayMessage.reply(`Congratulations ${winnerMentions}! You won **${prize}**!`);
        edit = EmbedBuilder.from(giveawayMessage.embeds[0])
            .setTitle('<a:giveaway:761350851725492265> Giveaway Ended <a:giveaway:761350851725492265>')
            .setDescription(`Prize: **${prize}**
            \n${winnersList.join(', ')} won the giveaway! <:love_u:792941995974852608>`)
            .setFooter({
                text: 'Giveaway hosted by Server Rift, Learn more at serverrift.com',
                iconURL: 'https://andrew-forster.github.io/Images/logofull.png'
            })
            .setColor('#68d26f');
    } else {
        giveawayMessage.reply('No one entered the giveaway, so no one wins!');
        edit = EmbedBuilder.from(giveawayMessage.embeds[0])
            .setTitle('<a:giveaway:761350851725492265> Giveaway Ended <a:giveaway:761350851725492265>')
            .setDescription(`Prize: **${prize}**\n\\# of Winners: **${winners}** 
            \n**No one entered the giveaway, so no one wins!**`)
            .setFooter({
                text: 'Giveaway hosted by Server Rift, Learn more at serverrift.com',
                iconURL: 'https://andrew-forster.github.io/Images/logofull.png'
            })
            .setColor('#e86a66');
    }

    const viewBtn = new ButtonBuilder()
    .setURL(`${domain}/giveaway?id=${id}`)
    .setLabel('View Results')
    .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder().addComponents(viewBtn);

    giveawayMessage.edit({
        embeds: [edit],
        components: [row]
    });
    removeGiveaway(giveaway.id, winnerNames, winnerIds);
}

// TODO: If already left, don't remove from users

function collect(message, duration, prize) {
    // Reaction Collector to respond to users entering
    const collector = message.createMessageComponentCollector({
        time: duration
    });

    
    const leaveBtn = new ButtonBuilder()
    .setCustomId('leave')
    .setLabel('Leave')
    .setStyle(ButtonStyle.Danger);

    const leave = new ActionRowBuilder().addComponents(leaveBtn);

    collector.on('collect', async interaction => {
        try {
            let users = await getGiveawayUsers(message.id);

            if (interaction.customId == 'enter' && users.includes(interaction.user.id)) {
                await interaction.reply({
                    content: `You have already entered the giveaway for **${prize}**!`,
                    // components: [leave],
                    ephemeral: true
                });
            } else {
                addGiveawayUser(message.id, interaction.user.id);
                await interaction.reply({
                    content: `You have entered the giveaway for **${prize}**!`,
                    // components: [leave],
                    ephemeral: true
                });
            }

            // Leave Button

            // const col = interaction.channel.createMessageComponentCollector({
            //     time: 10000
            // });
            // col.on('collect', async i => {
            //     users = await getGiveawayUsers(message.id);
            //     if (i.customId === 'leave' && users.includes(i.user.id)) {
            //         removeGiveawayUser(message.id, interaction.user.id);
            //         await i.reply({
            //             content: `You have left the giveaway for **${prize}**!`,
            //             ephemeral: true
            //         });
            //     } else {
            //         await i.reply({
            //             content: `You have already left the giveaway for **${prize}**!`,
            //             ephemeral: true
            //         });
            // }
            // });


        } catch (error) {
            console.log('Error handling interaction:', error);
            await interaction.reply({
                content: 'There was an error processing your request.',
                ephemeral: true
            });
        }

    });
}

function reqCollect(message, duration, prize) {
    // Reaction Collector to respond to users entering
    const collector = message.createMessageComponentCollector({
        time: duration
    });
    const leaveBtn = new ButtonBuilder()
    .setCustomId('leave')
    .setLabel('Leave')
    .setStyle(ButtonStyle.Danger);

    const leave = new ActionRowBuilder().addComponents(leaveBtn);

    collector.on('collect', async interaction => {
        try {
            let users = await getGiveawayUsers(message.id);
            let dbUser = await User.findOne(
                {
                    discordId: interaction.user.id
                }
            );
            if (!dbUser) {
                await interaction.reply({
                    content: `You have not registered with Server Rift yet! Please register with the bot to enter the giveaway for **${prize}**!`,
                    ephemeral: true
                });
                return;
            }

            if (interaction.customId == 'enter' && users.includes(interaction.user.id)) {
                await interaction.reply({
                    content: `You have already entered the giveaway for **${prize}**!`,
                    ephemeral: true
                });
            } else {
                addGiveawayUser(message.id, interaction.user.id);
                await interaction.reply({
                    content: `You have entered the giveaway for **${prize}**! Thanks for signing up for Server Rift!`,
                    ephemeral: true
                });
            }
        } catch (error) {
            console.log('Error handling interaction:', error);
            await interaction.reply({
                content: 'There was an error processing your request.',
                ephemeral: true
            });
        }

    });
}

module.exports = {
    checkGiveaways, saveGiveaway, loadGiveaways, removeGiveaway, giveawayComplete, addGiveawayUser, removeGiveawayUser,
    getGiveawayUsers, collect, reqCollect, genUUID
}







async function reactionGiveawayComplete(giveaway, client) {
    console.log('Giveaway complete!');
    const channel = giveaway.channelId;
    const message = giveaway.message;
    const winners = giveaway.winners;
    const prize = giveaway.prize;
    const guild = giveaway.guildId;


    const giveawayChannel = client.guilds.cache.get(guild).channels.cache.get(channel);
    const giveawayMessage = await giveawayChannel.messages.fetch(message);
    const reactions = await giveawayMessage.reactions.cache.get('🎉').users.fetch()
    const users = reactions.filter(user => !user.bot).map(user => user.id);
    const winnersList = [];
    for (let i = 0; i < winners; i++) {
        const winner = users[Math.floor(Math.random() * users.length)];
        if (winner) {
            winnersList.push(`<@${winner}>`);
        }
    }
    let edit;
    if (winnersList.length > 0) {
        const winnerMentions = winnersList.map(winner => winner.toString()).join(' ');
        giveawayChannel.send(`Congratulations ${winnerMentions}! You won **${prize}**!`);
        edit = EmbedBuilder.from(giveawayMessage.embeds[0])
            .setTitle('🎉 Giveaway Ended 🎉')
            .setDescription(`Prize: **${prize}**
            \n${winnersList.join(', ')} won the giveaway!`)
            .setFooter({
                text: 'Giveaway hosted by Server Rift, Learn more at serverrift.com',
                iconURL: 'https://andrew-forster.github.io/Images/logofull.png'
            })
            .setColor('#68d26f');
    } else {
        giveawayChannel.send('No one entered the giveaway, so no one wins!');
        edit = EmbedBuilder.from(giveawayMessage.embeds[0])
            .setTitle('🎉 Giveaway Ended 🎉')
            .setDescription(`Prize: **${prize}**\n\\# of Winners: **${winners}** 
            \n**No one entered the giveaway, so no one wins!**`)
            .setFooter({
                text: 'Giveaway hosted by Server Rift, Learn more at serverrift.com',
                iconURL: 'https://andrew-forster.github.io/Images/logofull.png'
            })
            .setColor('#e86a66');
    }
    giveawayMessage.edit({
        embeds: [edit]
    });
    giveawayMessage.reactions.removeAll();
    removeGiveaway(giveaway.id);
}