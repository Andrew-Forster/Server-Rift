const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');

require('dotenv').config();

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

        confirmation.on('collect', interaction => {

            switch (interaction.customId) {
                case 'home':
                    interaction.update({
                        embeds: [mainEmbed],
                        components: [mRow]
                    });
                    break;
                case 'rifting':
                    interaction.update({
                        embeds: [riftingEmbed],
                        components: [btnManager('rifting')]
                    });
                    break;
                case 'stats':
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
                case 'servers':
                    interaction.update({
                        embeds: [serversEmbed],
                        components: [btnManager('servers')]
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
                interaction.editReply({ components: [] });
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
    .setLabel('🌌 Rifting')
    .setStyle(ButtonStyle.Secondary);

const stats = new ButtonBuilder()
    .setCustomId('stats')
    .setLabel('⚙️ Stats')
    .setStyle(ButtonStyle.Secondary);

const links = new ButtonBuilder()
    .setCustomId('links')
    .setLabel('🔗 Links')
    .setStyle(ButtonStyle.Secondary);

const servers = new ButtonBuilder()
    .setCustomId('servers')
    .setLabel('🛡️ Manage')
    .setStyle(ButtonStyle.Secondary);



const mRow = new ActionRowBuilder()
    .addComponents(
        rifting,
        stats,
        links,
        servers
    );


    var componentsArr;
    
    function btnManager(page) {
    let oRow = new ActionRowBuilder()
    componentsArr = [rifting, stats, links, servers];
    switch (page) {
        case 'main':
            return mRow;
        case 'rifting':
            componentsArr.splice(0, 1);
            componentsArr.unshift(home);
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

const riftingEmbed = new EmbedBuilder()
    .setColor('#042d62')
    .setTitle('**Server Rift | Server Rifting**')
    .setURL('https://andrew-forster.github.io/')
    .setThumbnail('https://andrew-forster.github.io/Images/discordimg.png')

    .setDescription(
        '# **Commands**' +
        '\n\n' +
        '> **Force Add** (`forceAdd *[serverID] *[# of users] [niche]`) - Forces ALL users into a certain server.  ' +
        ' \n' +
        '> \n' +
        '> **Force** (`force *[serverID] *[# of users] [niche]`) - Force all opted users into a certain server.  ' +
        ' \n' +
        '> \n' +
        '> **Add** (`add *[serverID] *[userID]`) - Adds a user to a server ' +
        ' \n' +
        '> \n' +
        '> **Set Niche** (`set-niche *[serverID] *[niche1], [niche2], ...`) - Set/Request a server niche.' +
        '\n\n'

    )

    .setFooter({
        text: 'Server Rift',
        iconURL: 'https://andrew-forster.github.io/Images/logofull.png'
    })
    .setTimestamp();

//-------------
// Settings Res
//-------------

const statsEmbed = new EmbedBuilder()
    .setColor('#042d62')
    .setTitle('**Server Rift | STATS**')
    .setURL('https://andrew-forster.github.io/')
    .setThumbnail('https://andrew-forster.github.io/Images/discordimg.png')

    .setDescription(
        '# **STATS**' +
        '\n\n' +
        '**Total Authed Count**: `1`' +
        '\n\n' +
        '**Opted Auth Count**: `1` ' +
        '\n\n' +
        '**Total Servers**: `1` ' +
        '\n\n' +
        
        '# **Niche Auth Counts**: ' +
        '\n\n' +
        '>>> Social: `1`\n' +
        'Anime: `1`\n' +
        'Giveaway: `1`\n' +
        'Minecraft: `1`\n' +
        'Roblox: `1`\n' +
        'Fortnite: `1`\n' +
        'Music: `1`\n' +  
        'Meme: `1`\n'

    )

    .setFooter({
        text: 'Server Rift',
        iconURL: 'https://andrew-forster.github.io/Images/logofull.png'
    })
    .setTimestamp();

//--------------
// Questions Res
//--------------

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
        '**[User Auth Link Finish Steps](https://discord.com/oauth2/authorize?client_id=1222987237919162448&response_type=code&redirect_uri=https%3A%2F%2Fandrew-forster.github.io%2Ffinish&scope=identify+guilds.join+guilds)**' +
        '\n\n' +
        '**[Website]()**' +
        '\n\n' 
    )

    .setFooter({
        text: 'Server Rift',
        iconURL: 'https://andrew-forster.github.io/Images/logofull.png'
    })
    .setTimestamp();

//--------------
// Questions Res
//--------------

const serversEmbed = new EmbedBuilder()
    .setColor('#042d62')
    .setTitle('**Server Rift | Server Manager**')
    .setURL('https://andrew-forster.github.io/')
    .setThumbnail('https://andrew-forster.github.io/Images/discordimg.png')

    .setDescription(
        '# **Server Settings**' +
        '\n\n' +
        '> **Prefix**: `.` ' +
        '\n\n' +
        '# **Server Commands**' +
        '\n\n' +
        '> **View Stats** (`stats`) - View server rift stats like joins, leaves, etc. ' +
        ' \n' +
        '> \n' +
        '> **Ads** (`ads`) - Learn more about Server Rift Ads. ' +
        ' \n' +
        '> \n' +
        '> **Niche** (`niche`) - Set/Request a server niche.' +
        '\n\n'

    )

    .setFooter({
        text: 'Server Rift',
        iconURL: 'https://andrew-forster.github.io/Images/logofull.png'
    })
    .setTimestamp();