const { SlashCommandBuilder, EmbedBuilder }  = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('husbando')
        .setDescription(`Get your husbando rolled for free`),
    async execute(interaction) {
        var request = require('request');
        
        request("https://nekos.best/api/v2/husbando", function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            data = data["results"][0];
            var husbando = data["url"];
            var sourceURL = data["source_url"];
            var artist = data["artist_name"];
            const husbandoEmbed = new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle(`Artist - ${artist}`)
            .setURL(sourceURL)
            .setImage(husbando)
            .setFooter({text: '💖 Powered by nekos.best'});
            interaction.reply({embeds:[husbandoEmbed]})
          } else {
            if(error)  { 
              console.log(error);
              if(response && response.statusCode) console.log(`Response code: ${response.statusCode}`);
            }
            return interaction.reply("There was an error, please try again later")
          }
        });
		
	},
};
