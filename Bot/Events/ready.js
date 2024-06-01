const {
	Events
} = require('discord.js');

const dbConnection = require('../../server.js'); // Import the exported connection from server.js

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		if (dbConnection.readyState === 1) {
			console.log('Bot is connected to the database.');
		} else {
			console.log('Bot failed to connect to the database.');
		}
		// Set up error handling
		process.on('uncaughtException', (error) => {
			console.error('Uncaught Exception:', error);
			logErrorToDiscord(error);
		});

		process.on('unhandledRejection', (reason, promise) => {
			console.error('Unhandled Rejection at:', promise, 'reason:', reason);
			logErrorToDiscord(reason);
		});
	},
};

logErrorToDiscord = (error) => {
	const errorChannel = client.channels.cache.get(process.env.errorChannel);
	if (errorChannel) {
		errorChannel.send(`An error occurred: \`\`\`${error}\`\`\``);
	}
};