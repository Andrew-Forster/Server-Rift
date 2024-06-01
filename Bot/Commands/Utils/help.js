const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');

const mongoose = require('mongoose');
const User = require('../../../src/models/user'); // Import your User model
const dbConnection = require('../../../server.js'); // Import the exported connection from server.js


module.exports = {
    aliases: ['h'],
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Returns a list of all commands available to you.'),

    async execute(interaction) {
        const response = await interaction.reply({
            embeds: [mainEmbed],
            components: [mRow],
            fetchReply: true
        });

        const collectorFilter = i => i.user.id === interaction.user.id;
        const confirmation = await response.createMessageComponentCollector({
            filter: collectorFilter,
            time: 60_000
        });

        confirmation.on('collect', async interaction => {
            let userID = interaction.user.id;

            let user = await User.findOne({
                discordId: userID
            });

            const profileEmbed = {
                color: 0x042d62,
                title: '**Server Rift | Profile**',
                url: 'https://andrew-forster.github.io/',
                author: {
                    name: `${interaction.user.username}'s Profile`,
                    icon_url: interaction.user.displayAvatarURL(),
                },
                description: 
                    `> **Servers Joined**: \`${user.stats.serversJoined}\` \n` +
                    `> \n` +
                    `> **Rift Activity Level**: \`${user.stats.activityLevel}\` \n` +
                    `> \n` +
                    `> **Activity Rank**: \`${user.stats.activityRank}\` \n` +
                    `> \n` +
                    `> **Servers Left**: \`${user.stats.serversLeft}\`\n\n`,
                thumbnail: {
                    url: 'https://andrew-forster.github.io/Images/discordimg.png',
                },
                footer: {
                    text: 'Server Rift',
                    icon_url: 'https://andrew-forster.github.io/Images/logofull.png',
                },
                timestamp: new Date().toISOString(),
            };
            
            const prefsEmbed = {
                color: 0x042d62,
                title: '**Server Rift | Preferences**',
                url: 'https://andrew-forster.github.io/',
                author: {
                    name: `${interaction.user.username}'s Preferences`,
                    icon_url: interaction.user.displayAvatarURL(),
                },
                description: 
                `**Weekly Server Rift**: ${user.settings.weeklyRift ? '✅' : '❌'} \n\n` +
                `**Random Server Rift**: ${user.settings.randomRift ? '✅' : '❌'} \n\n` +
                `**Join Notifications**: ${user.settings.joinNotif ? '✅' : '❌'} \n\n` +
                `**Update Notifications**: ${user.settings.updateNotif ? '✅' : '❌'} \n\n` +
                `**Server Interests**:\n` +
                user.settings.serverInterests.map(interest => `> ${interest}`).join('\n') + '\n\n' +
                '`Edit your preferences by clicking the button below!`',
                thumbnail: {
                    url: 'https://andrew-forster.github.io/Images/discordimg.png',
                },
                footer: {
                    text: 'Server Rift',
                    icon_url: 'https://andrew-forster.github.io/Images/logofull.png',
                },
                timestamp: new Date().toISOString(),
            };

            const qEmbed = {
                color: 0x042d62,
                title: '**Server Rift | Commonly Asked Questions**',
                url: 'https://andrew-forster.github.io/',
                description:
                    '> **Will I be added to servers more than once?**\n' +
                    '`No, you will only ever be added to a server once.`\n\n' +
                    '> **What if I don\'t like the servers I\'m added to?**\n' +
                    '`You are always free to leave, you can also change your preferences if you decide you don\'t like a niche.`\n\n' +
                    '> **What if I don\'t want to be added to servers anymore?**\n' +
                    '`You can opt out of being added to server by heading to our website.`\n\n' +
                    '> **How can I change my preferences?**\n' +
                    '`Head over to our website by using the button below and going to your profile!`',
                thumbnail: {
                    url: 'https://andrew-forster.github.io/Images/discordimg.png',
                },
                footer: {
                    text: 'Server Rift',
                    icon_url: 'https://andrew-forster.github.io/Images/logofull.png',
                },
                timestamp: new Date().toISOString(),
            };
            // TODO: Change to recently joined servers
            const manageEmbed = {
                color: 0x042d62,
                title: '**Server Rift | Server Manager**',
                url: 'https://andrew-forster.github.io/',
                author: {
                    name: 'Server Settings',
                    icon_url: interaction.user.displayAvatarURL(),
                },
                description: 
                    `# **Server Settings**\n\n` +
                    `> **Prefix**: \`.\`\n\n` +
                    `# **Server Commands**\n\n` +
                    `> **View Stats** (\`stats\`) - View server rift stats like joins, leaves, etc.\n` +
                    `> \n` +
                    `> **Ads** (\`ads\`) - Learn more about Server Rift Ads.\n` +
                    `> \n` +
                    `> **Niche** (\`niche\`) - Set/Request a server niche.\n\n`,
                thumbnail: {
                    url: 'https://andrew-forster.github.io/Images/discordimg.png',
                },
                footer: {
                    text: 'Server Rift',
                    icon_url: 'https://andrew-forster.github.io/Images/logofull.png',
                },
                timestamp: new Date().toISOString(),
            };
            

            switch (interaction.customId) {
                case 'home':
                    interaction.update({
                        embeds: [mainEmbed],
                        components: [mRow]
                    });
                    break;
                case 'profile':
                    if (!user) {
                        interaction.update({
                            embeds: [createEmbed],
                            components: [btnManager('profile')]
                        });
                        break;
                    }
                    interaction.update({
                        embeds: [profileEmbed],
                        components: [btnManager('profile')]
                    });
                    break;
                case 'prefs':
                    if (!user) {
                        interaction.update({
                            embeds: [createEmbed],
                            components: [btnManager('prefs')]
                        });
                        break;
                    }
                    interaction.update({
                        embeds: [prefsEmbed],
                        components: [btnManager('prefs')]
                    });
                    break;
                case 'questions':
                    interaction.update({
                        embeds: [qEmbed],
                        components: [btnManager('questions')]
                    });
                    break;
                case 'manage':
                    interaction.update({
                        embeds: [manageEmbed],
                        components: [btnManager('manage')]
                    });
                    break;
                default:
                    interaction.update({
                        content: 'Invalid selection: ' + interaction.customId,
                        components: []
                    });
                    break;
            }
            
        });
        try {
            confirmation.on('end', () => {
                interaction.editReply({
                    components: []
                });
            });
        } catch (error) {}
    },
};

//-----------
// Help Menus
//-----------

const mainEmbed = new EmbedBuilder()
    .setColor('#042d62')
    .setTitle('**Server Rift | Command Options**')
    .setURL('https://andrew-forster.github.io/')
    .setThumbnail('https://andrew-forster.github.io/Images/discordimg.png')

    .setDescription(
        'Welcome to Server Rift\'s help menu! View categories below to see available commands.' +
        '\n\n' +
        '# **Categories**' +
        '\n' +
        '> 👤 **Your Profile** (`profile`) - View User Stats' +
        ' \n' +
        '> \n' +
        '> ⚙️ **Settings & Preference** (`prefs`) - User Settings' +
        ' \n' +
        '> \n' +
        '> ❓ **Questions** (`questions`) - Q & A' +
        ' \n' +
        '> \n' +
        '> 🛡️ **Manage Server Settings** (`manage`) - For Server Owners' +
        '\n\n' +
        '**Misc Commands**\n\n' +
        '> 🔗 **Links** (`links`) - Returns all associated Server Rift links!' +
        ' \n' +
        '> \n' +
        '> 🔗 **Ping** (`ping`) - Checks bot ping' +
        '\n\n'

    )

    .setFooter({
        text: 'Server Rift',
        iconURL: 'https://andrew-forster.github.io/Images/discordimg.png'
    })
    .setTimestamp();

    const createEmbed = {
        color: 0x042d62,
        title: '**Server Rift | Account Not Found!**',
        url: 'https://andrew-forster.github.io/',
        description: 
            `**Your discord account was not found in our database**\n\n` +
            `> \`Please create an account by clicking the button below!\`\n\n`,
        thumbnail: {
            url: 'https://andrew-forster.github.io/Images/discordimg.png',
        },
        footer: {
            text: 'Server Rift',
            icon_url: 'https://andrew-forster.github.io/Images/logofull.png',
        },
        timestamp: new Date().toISOString(),
    };

const home = new ButtonBuilder()
    .setCustomId('home')
    .setLabel('↩️ Return Home')
    .setStyle(ButtonStyle.Success);

const profile = new ButtonBuilder()
    .setCustomId('profile')
    .setLabel('👤 Profile')
    .setStyle(ButtonStyle.Secondary);

const prefs = new ButtonBuilder()
    .setCustomId('prefs')
    .setLabel('⚙️Preferences')
    .setStyle(ButtonStyle.Secondary);

const questions = new ButtonBuilder()
    .setCustomId('questions')
    .setLabel('❓ Questions')
    .setStyle(ButtonStyle.Secondary);

const manage = new ButtonBuilder()
    .setCustomId('manage')
    .setLabel('🛡️ Manage')
    .setStyle(ButtonStyle.Secondary);

const link = new ButtonBuilder()
    .setLabel('Manage Account')
    .setStyle(ButtonStyle.Link)
    .setURL('https://andrew-forster.github.io/');


const mRow = new ActionRowBuilder()
    .addComponents(
        profile,
        prefs,
        questions,
        manage,
        link
    );


var componentsArr;

function btnManager(page) {
    let oRow = new ActionRowBuilder()
    componentsArr = [profile, prefs, questions, manage, link];
    switch (page) {
        case 'main':
            return mRow;
        case 'profile':
            componentsArr.splice(0, 1);
            componentsArr.unshift(home);
            break;
        case 'prefs':
            componentsArr.splice(1, 1);
            componentsArr.unshift(home);
            break;
        case 'questions':
            componentsArr.splice(2, 1);
            componentsArr.unshift(home);
            break;
        case 'manage':
            componentsArr.splice(3, 1);
            componentsArr.unshift(home);
            break;
        default:
            break;

    }
    oRow.addComponents(componentsArr);
    return oRow;
}