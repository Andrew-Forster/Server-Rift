require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const devCommands = [];

// Grab all the command folders from the Commands directory
const foldersPath = path.join(__dirname, 'Commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    // Grab all the command files from the command directory
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            if (folder === 'Admin') {
                // Add admin commands to devCommands
                devCommands.push(command.data.toJSON());
            } else {
                devCommands.push(command.data.toJSON());
                commands.push(command.data.toJSON());
            }
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.token);

// Function to push commands to all servers
const pushGlobalCommands = async () => {
    try {
        console.log(`Started refreshing ${commands.length} global (/) commands.`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.clientId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} global (/) commands.`);
    } catch (error) {
        console.error(error);
    }
};

// Function to push commands to a specific server (in this case, your dev server)
const pushDevServerCommands = async () => {
    try {
        console.log(`Started refreshing dev server (${process.env.guildId}) commands.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.clientId, process.env.guildId),
            { body: devCommands},
        );

        console.log(`Successfully reloaded ${data.length} dev server (${process.env.guildId}) commands.`);
    } catch (error) {
        console.error(error);
    }
};

// Call the functions to push commands
(async () => {
    await pushGlobalCommands();
    await pushDevServerCommands();
})();
