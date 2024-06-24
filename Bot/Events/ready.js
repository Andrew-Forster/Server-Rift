const {
	Events
} = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`[bot] Ready! Logged in as ${client.user.tag}`);
		// Set up error handling
		process.on('uncaughtException', (error) => {
			console.error('Uncaught Exception:', error);
			logErrorToDiscord(error);
		});

		process.on('unhandledRejection', (reason, promise) => {
			console.error('[bot] Unhandled Rejection at:', promise, 'reason:', reason);
			logErrorToDiscord(reason);
		});
		
		logErrorToDiscord = (error) => {
			const errorChannel = client.channels.cache.get(process.env.errorChannel);
			if (errorChannel) {
				errorChannel.send(`[bot] An error occurred: \`\`\`${error}\`\`\``);
			}
		};


		const giveaways = require('../timers/giveaways.js');
		giveaways.checkGiveaways(client); // Start the giveaway timer








	},
};
