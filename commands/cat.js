const { SlashCommandBuilder, EmbedBuilder }  = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Get a cat pic!'),
    async execute(interaction) {
        var request = require('request');
        
        request("http://api.thecatapi.com/v1/images/search", function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            var cat = data[0]["url"];
            const catEmbed = new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle("😻")
            .setImage(cat)
            .setFooter({text: '💖 Powered by The Cat API'});
            interaction.reply({embeds:[catEmbed]})
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
