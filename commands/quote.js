const { SlashCommandBuilder }  = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription(`Need some wisdom in your life?`),
    async execute(interaction) {
        var request = require('request');
        request("https://api.quotable.io/random?maxLength=150&tags=famous-quotes", function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            var joke = data["content"];
            var author = data["author"];
            return interaction.reply(joke + " - " + author);
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
