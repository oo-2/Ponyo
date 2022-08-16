const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const config = require('../config.json');
const path = require('path');
const commands = [];
const commandsPath = path.join(__dirname,"../commands/")
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(commandsPath+file);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(config.token);


(async () => {
	try {
		console.log('Started refreshing application (/) commands.');
		await rest.put(
			Routes.applicationCommands(config.clientId),
			{ body: commands },
		);
		console.log('Successfully loaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
