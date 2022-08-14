const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Get all the info on the bot'),
    async execute(interaction) {
	const ping = new EmbedBuilder()
        .setColor("#5865f4")
        .setTitle("🤖 Bot Stats")
        .setThumbnail(interaction.client.user.displayAvatarURL({dynamic: true, size: 1024}))
        .setDescription(`
        • Users: \`${interaction.client.users.cache.size}\`
        • Servers: \`${interaction.client.guilds.cache.size}\`
        • Channels: \`${interaction.client.channels.cache.size}\`
        • Commands: \`${interaction.client.commands.map(c => c.name).length}\`
        • Memory Usage: \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\`
        • Ping: \`${interaction.client.ws.ping} MS\`
        • Current Uptime: <t:${Math.floor(Number(Date.now() - interaction.client.uptime) / 1000)}:R>`
        )
        .setTimestamp();
        interaction.reply({embeds:[ping]});
	},
};