const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');

require('dotenv').config();

const User = require('../../../src/models/user'); // Import your User model
const Server = require('../../../src/models/servers'); // Import your Server model

module.exports = {
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName('ahelp')
        .setDescription('Returns a Admin Command List.'),

    async execute(interaction) {

        if (!process.env.adminUsers.includes(interaction.user.id)) {
            return interaction.reply('Sorry, you do not have permission to use this command.');
        }

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

            let totalAuthed = await User.countDocuments();
            let optedAuthed = await User.countDocuments({
                'settings.weeklyRift': true
            });
            let totalServers = await Server.countDocuments();
            
            let interests = {
                'Social': 0,
                'Anime': 0,
                'Giveaway': 0,
                'Minecraft': 0,
                'Roblox': 0,
                'Fortnite': 0,
                'Music': 0,
                'Meme': 0
            }

            for (key in interests) {
                interests[key] = await User.countDocuments({
                    'settings.serverInterests': key,
                });
            }
            

            switch (interaction.customId) {
                case 'home':
                    interaction.update({
                        embeds: [mainEmbed],
                        components: [mRow]
                    });
                    break;
                case 'rifting':
                    interaction.update({
                        embeds: [cmdEmbed],
                        components: [btnManager('rifting')]
                    });
                    break;
                case 'authCmds':
                    interaction.update({
                        embeds: [authEmbed],
                        components: [btnManager('rifting')]
                    });
                    break;
                case 'serverCmds':
                    interaction.update({
                        embeds: [serverEmbed],
                        components: [btnManager('rifting')]
                    });
                    break;
                case 'generalCmds':
                    interaction.update({
                        embeds: [generalEmbed],
                        components: [btnManager('rifting')]
                    });
                    break;
                case 'stats':

                    //-------------
                    // Stats Res
                    //-------------

                    const statsEmbed = new EmbedBuilder()
                        .setColor('#042d62')
                        .setTitle('**Server Rift | STATS**')
                        .setURL('https://andrew-forster.github.io/')
                        .setThumbnail('https://andrew-forster.github.io/Images/discordimg.png')

                        .setDescription(
                            `# **STATS**` +
                            '\n\n' +
                            `**Total Authed Count**: \`${totalAuthed}\`` +
                            '\n\n' +
                            `**Opted Auth Count**: \`${optedAuthed}\`` +
                            '\n\n' +
                            `**Total Servers**: \`${totalServers}\`` +
                            '\n\n' +

                            `# **Niche Auth Counts**: ` +
                            '\n\n' +
                            `>>> Social: \`${interests.Social}\`\n` +
                            `Anime: \`${interests.Anime}\`\n` +
                            `Giveaway: \`${interests.Giveaway}\`\n` +
                            `Minecraft: \`${interests.Minecraft}\`\n` +
                            `Roblox: \`${interests.Roblox}\`\n` +
                            `Fortnite: \`${interests.Fortnite}\`\n` +
                            `Music: \`${interests.Music}\`\n` +
                            `Meme: \`${interests.Meme}\`\n`

                        )

                        .setFooter({
                            text: 'Server Rift',
                            iconURL: 'https://andrew-forster.github.io/Images/logofull.png'
                        })
                        .setTimestamp();
                    interaction.update({
                        embeds: [statsEmbed],
                        components: [btnManager('stats')]
                    });
                    break;
                case 'links':
                    interaction.update({
                        embeds: [linksEmbed],
                        components: [btnManager('links')]
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
    .setTitle('**Server Rift | Admin Panel**')
    .setURL('https://andrew-forster.github.io/')
    .setThumbnail('https://andrew-forster.github.io/Images/discordimg.png')

    .setDescription(
        '# **Actions**' +
        '\n' +
        '> **Server Rifting**' +
        ' \n' +
        '> \n' +
        '> **Stats** (`stats`)' +
        ' \n' +
        '> \n' +
        '> **Important Links**' +
        ' \n' +
        '> \n' +
        '> **Manage Servers**'

    )

    .setFooter({
        text: 'Server Rift',
        iconURL: 'https://andrew-forster.github.io/Images/discordimg.png'
    })
    .setTimestamp();


const home = new ButtonBuilder()
    .setCustomId('home')
    .setLabel('↩️ Return Home')
    .setStyle(ButtonStyle.Success);

const rifting = new ButtonBuilder()
    .setCustomId('rifting')
    .setLabel('🌌 Commands')
    .setStyle(ButtonStyle.Secondary);

const stats = new ButtonBuilder()
    .setCustomId('stats')
    .setLabel('⚙️ Stats')
    .setStyle(ButtonStyle.Secondary);

const links = new ButtonBuilder()
    .setCustomId('links')
    .setLabel('🔗 Links')
    .setStyle(ButtonStyle.Secondary);

const authCmds = new ButtonBuilder()
    .setCustomId('authCmds')
    .setLabel('🛡️ Auth Cmds')
    .setStyle(ButtonStyle.Secondary);
const serverCmds = new ButtonBuilder()
    .setCustomId('serverCmds')
    .setLabel('🛡️ Server Cmds')
    .setStyle(ButtonStyle.Secondary);
const generalCmds = new ButtonBuilder()
    .setCustomId('generalCmds')
    .setLabel('🛡️ General Cmds')
    .setStyle(ButtonStyle.Secondary);



const mRow = new ActionRowBuilder()
    .addComponents(
        rifting,
        stats,
        links
    );


var componentsArr;

function btnManager(page) {
    let oRow = new ActionRowBuilder()
    componentsArr = [rifting, stats, links];
    switch (page) {
        case 'main':
            return mRow;
        case 'rifting':
            componentsArr = [home, authCmds, serverCmds, generalCmds];
            break;
        case 'stats':
            componentsArr.splice(1, 1);
            componentsArr.unshift(home);
            break;
        case 'links':
            componentsArr.splice(2, 1);
            componentsArr.unshift(home);
            break;
        case 'servers':
            componentsArr.splice(3, 1);
            componentsArr.unshift(home);
            break;
        default:
            break;

    }
    oRow.addComponents(componentsArr);
    return oRow;
}

//------------
// Profile Res
//------------

// TODO: Add eval, servers, announce, 

const cmdEmbed = new EmbedBuilder()
    .setColor('#042d62')
    .setTitle('**Server Rift | Admin Commands**')
    .setURL('https://andrew-forster.github.io/')
    .setThumbnail('https://andrew-forster.github.io/Images/discordimg.png')

    .setDescription(
        '### **Command Menu**' +
        '\n\n' +
        '> **Auth**' +
        ' \n' +
        '> \n' +
        '> **Server**' +
        ' \n' +
        '> \n' +
        '> **Misc**' +
        ' \n' +
        ' \n'
    )
    .setFooter({
        text: 'Server Rift',
        iconURL: 'https://andrew-forster.github.io/Images/logofull.png'
    })
    .setTimestamp();

const authEmbed = new EmbedBuilder()
    .setColor('#042d62')
    .setTitle('**Server Rift | Auth Commands**')
    .setURL('https://andrew-forster.github.io/')
    .setThumbnail('https://andrew-forster.github.io/Images/discordimg.png')

    .setDescription(
        '### **Auth**' +
        '\n\n' +
        '> **Add** (`add *[serverID] *[# of users] [niche]`) - Forces opted users into a certain server. (Opted being the random rift)' +
        ' \n' +
        '> \n' +
        '> **Force** (`force *[serverID] *[# of users] [niche]`) - Force ALL available users into a certain server.  ' +
        ' \n' +
        '> \n' +
        '> **Single** (`single *[serverID] *[userID]`) - Adds a user to a server ' +
        ' \n' +
        ' \n'

    )
    .setFooter({
        text: 'Server Rift',
        iconURL: 'https://andrew-forster.github.io/Images/logofull.png'
    })
    .setTimestamp();

const serverEmbed = new EmbedBuilder()
    .setColor('#042d62')
    .setTitle('**Server Rift | Server Commands**')
    .setURL('https://andrew-forster.github.io/')
    .setThumbnail('https://andrew-forster.github.io/Images/discordimg.png')

    .setDescription(
        '### **Server**' +
        '\n\n' +
        '> **Servers** (`servers`) - View a list of all servers.' +
        ' \n' +
        '> \n' +
        '> **Set Niche** (`set-niche *[serverID] *[niche1], [niche2], ...`) - Set/Request a server niche.' +
        ' \n' +
        '> \n' +
        '> **Add Server** (`add-server *[serverID]*, [serverID2], [serverID3], ...`) - Add\'s a server to the bot' +
        '\n' +
        '> \n' +
        '> **Remove Server** (`remove-server *[serverID]*, [serverID2], [serverID3], ...`) - Remove\'s a server from the bot' +
        ' \n' +
        ' \n' +
        '> **Server Info** (`server-info *[serverID]`) - Get info on a server.' +
        ' \n' +
        ' \n' +
        '> **Leave Server** (`leave-server *[serverID]`) - Make the bot leave a server.' +
        ' \n' +
        ' \n'

    )
    .setFooter({
        text: 'Server Rift',
        iconURL: 'https://andrew-forster.github.io/Images/logofull.png'
    })
    .setTimestamp();

const generalEmbed = new EmbedBuilder()
    .setColor('#042d62')
    .setTitle('**Server Rift | General Commands**')
    .setURL('https://andrew-forster.github.io/')
    .setThumbnail('https://andrew-forster.github.io/Images/discordimg.png')

    .setDescription(
        '### **Misc**' +
        '\n\n' +
        '> **Eval** (`eval *[code]`) - Evaluate code.' +
        ' \n' +
        '> \n' +
        '> **Announce** (`announce *[message]`) - Announce a message to users.' +
        ' \n' +
        ' \n' +
        '> **Giveaway** (`giveaway *[serverID] *[channelID] *[prize] *[time]`) - Start a giveaway.' +
        ' \n' +
        ' \n' 

    )
    .setFooter({
        text: 'Server Rift',
        iconURL: 'https://andrew-forster.github.io/Images/logofull.png'
    })
    .setTimestamp();




const linksEmbed = new EmbedBuilder()
    .setColor('#042d62')
    .setTitle('**Server Rift | Important Links**')
    .setURL('https://andrew-forster.github.io/')
    .setThumbnail('https://andrew-forster.github.io/Images/discordimg.png')

    .setDescription(
        '**[Bot Invite Link](https://discord.com/oauth2/authorize?client_id=1222987237919162448&permissions=139586717761&scope=bot)**' +
        '\n\n' +
        '**[User Auth Link Login](https://discord.com/oauth2/authorize?client_id=1222987237919162448&response_type=code&redirect_uri=https%3A%2F%2Fandrew-forster.github.io%2Flogin&scope=identify+guilds.join+guilds)**' +
        '\n\n' +
        '**[Website]()**' +
        '\n\n'
    )

    .setFooter({
        text: 'Server Rift',
        iconURL: 'https://andrew-forster.github.io/Images/logofull.png'
    })
    .setTimestamp();