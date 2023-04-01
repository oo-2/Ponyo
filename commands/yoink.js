const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {  
	data: new SlashCommandBuilder()
		.setName('yoink')
		.setDescription('Yoinks an emote and uploads to the server.')
        .addStringOption(option => option.setName('emote').setDescription('Paste one emote, the link, or enter the ID'))
        .addStringOption(option => option.setName('name').setDescription('Enter the desired emote name'))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageEmojisAndStickers),
    async execute(interaction) {
        var emoteID = interaction.options.getString('emote').replace(/\D+/g,'');
        var fileExt = `.gif`;
        var url = `https://cdn.discordapp.com/emojis/${emoteID}`;
        var emoteName = emoteID;
        if (interaction.options.getString('name')) emoteName = interaction.options.getString('name');
        var request = require('request');
        request(url+fileExt, function (error, response) {
            if (!error && response.statusCode == 200) {
                interaction.guild.emojis.create({attachment: url+fileExt, name: emoteName})
                .then(emoji => 
                interaction.reply({content: `Successfully uploaded <a:${emoji.name}:${emoji.id}>!`, ephemeral: false}))
                .catch(
                    function() {
                    console.error;
                    interaction.reply({content: `Failed to upload ${emoteName}!`, ephemeral: true}
                )});
            } else {
                fileExt = `.png`
                interaction.guild.emojis.create({attachment: url+fileExt, name: emoteName})
                .then(emoji => 
                interaction.reply({content: `Successfully uploaded <:${emoji.name}:${emoji.id}>!`, ephemeral: false}))
                .catch(
                    function() {
                    console.error;
                    interaction.reply({content: `Failed to upload ${emoteName}!`, ephemeral: true}
                )});
            }
            
        });
	},
};