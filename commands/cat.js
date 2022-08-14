const { SlashCommandBuilder }  = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('funfact')
        .setDescription('Get the most fun from a fact possible!'),
    async execute(interaction) {
        var request = require('request');
        
        request("https://api.thecatapi.com/v1/images/search", function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            var cat = data["url"];
            return interaction.reply("Cat: "+cat);
          } else {
            if(error) console.log(error);
            if(response.statusCode != 200) console.log(`Response code: ${response.statusCode}, message: ${response.statusMessage}`);
            return interaction.reply("There was an error, please try again later")
          }
        });
		
	},
};
