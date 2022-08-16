const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with the latency'),
    async execute(interaction) {
	const ping = new EmbedBuilder()
        .setColor("#00FF00")
        .setTitle(":ping_pong:  Pong!")
        .setDescription(`**${Math.round(interaction.client.ws.ping)}** ms`)
        .setTimestamp();
        interaction.reply({embeds:[ping], ephemeral: true});
	},
};