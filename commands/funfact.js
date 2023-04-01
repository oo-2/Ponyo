const { SlashCommandBuilder }  = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('funfact')
        .setDescription('Get the most fun from a fact possible!'),
    async execute(interaction) {
      var rand = Math.floor(Math.random() * 2);
      var request = require('request');
      if ( rand == 0) {
        request("https://uselessfacts.jsph.pl/random.json?language=en", function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            var fact = data["text"];
            return interaction.reply(fact);
          } else {
            if(error) console.log(error);
            if(response.statusCode != 200) console.log(`Response code: ${response.statusCode}, message: ${response.statusMessage}`);
            return interaction.reply("There was an error, please try again later")
          }
        });
      } else {
      request("https://asli-fun-fact-api.herokuapp.com/", function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var data = JSON.parse(body);
          var fact = data["data"]["fact"];
          fact = fact.replace(/[?.!,;]?$/g,'');
          return interaction.reply("Did you know that "+fact.toLowerCase()+"?");
        } else {
          if(error)  { 
            console.log(error);
            if(response.statusCode) console.log(`Response code: ${response.statusCode}, message: ${response.statusMessage}`);
          }
          return interaction.reply("There was an error, please try again later")
        }
        });
      }
		
	},
};
