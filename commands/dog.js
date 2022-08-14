const { SlashCommandBuilder, EmbedBuilder }  = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dog')
        .setDescription('Get a dog pic!'),
    async execute(interaction) {
        var request = require('request');
        
        request("https://dog.ceo/api/breeds/image/random", function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            var dog = data["message"];
            const dogEmbed = new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle("🐶")
            .setImage(dog)
            .setFooter({text: '💖 Powered by Dog API'});
            interaction.reply({embeds:[dogEmbed]})
          } else {
            if(error) console.log(error);
            if(response.statusCode != 200) console.log(`Response code: ${response.statusCode}, message: ${response.statusMessage}`);
            return interaction.reply("There was an error, please try again later")
          }
        });
		
	},
};
