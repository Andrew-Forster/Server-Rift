//TODO: 

require('dotenv').config();
const {
	Client,
	Collection,
	GatewayIntentBits
} = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers
	]
});
client.commands = new Collection();
client.cooldowns = new Collection();

async function startBot() {
	await loadCommands();
	await loadEvents();
	await client.login(process.env.token);
}

async function loadCommands() {
	const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'));
	for (const folder of commandFolders) {
		const commandFiles = fs.readdirSync(path.join(__dirname, 'commands', folder)).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const command = require(path.join(__dirname, 'commands', folder, file));
			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
			} else {
				console.log(`[WARNING] The command at ${path.join(__dirname, 'commands', folder, file)} is missing a required "data" or "execute" property.`);
			}
		}
	}
}

async function loadEvents() {
	const eventFiles = fs.readdirSync(path.join(__dirname, 'Events')).filter(file => file.endsWith('.js'));
	for (const file of eventFiles) {
		const event = require(path.join(__dirname, 'Events', file));
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}
}

module.exports = {
	startBot
};