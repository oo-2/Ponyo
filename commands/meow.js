const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('meow')
		.setDescription('meow'),
	async execute(interaction) {
		return interaction.reply("meow");
	},
};