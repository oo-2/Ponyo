const { Client, IntentsBitField, Collection, ActivityType } = require('discord.js');
const intents = new IntentsBitField();
intents.add(IntentsBitField.Flags.GuildPresences, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.Guilds)
const client = new Client({ intents: intents });
const config = require('./config.json');
const commandHandler = require('./handlers/command.js')
var request = require('request');
const fs = require('fs');
var DEBUG = 1;
var cryptoCount = 0;
client.commands = new Collection();
const commandsPath = './commands/';
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(commandsPath+file);
	client.commands.set(command.data.name, command);
}

client.on('ready', () => { 
  console.log(`Logged in as ${client.user.tag}!`);
  cryptoPrices();
    
});
client.on('message', async msg => {

});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);
  if(DEBUG == 1) console.log(`The ${interaction.commandName} command was ran`)
	if (!command) return;

	try {
		await command.execute(interaction);
    
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

async function cryptoPrices(){
  const cryptoID = ['bitcoin', 'litecoin', 'ethereum']
  var currCrypto = cryptoID[cryptoCount%cryptoID.length]
  request("https://api.coincap.io/v2/assets/"+currCrypto, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var prices = JSON.parse(body);
      var priceChange = parseFloat(prices["data"]["changePercent24Hr"]).toFixed(2);
      var price = parseFloat(prices["data"]["priceUsd"]).toFixed(2);
      var symbol = prices["data"]["symbol"];
      price = price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      if(DEBUG == 1) console.log(`Current price of ${symbol} is ${price} and price change is ${priceChange}%`)
      if(priceChange > 0) 
        client.user.setPresence({ activities: [{ name:  symbol + ' $'+price+'↑'+priceChange+'%', type: ActivityType.Playing}], status: 'online'});
      if(priceChange < 0) 
        client.user.setPresence({ activities: [{ name: symbol + ' $'+price+'↓'+priceChange+'%', type: ActivityType.Playing}], status: 'dnd'});
    }
    if(error){
      client.user.setPresence({ activities: [{ name: 'API Error', type: ActivityType.Watching}], status: 'idle'});
      if(DEBUG == 1) console.log(`Error with calculating price change in ${currCrypto}`)
    }
    if(response.statusCode != 200){
      console.log(`Current Crypto: ${currCrypto} Bad response code: ${response.statusCode}, message: ${response.statusMessage}`);
    }
  });
    cryptoCount++;
    if(DEBUG == 1) console.log(`Crypto count is ${cryptoCount}`)
    setTimeout(cryptoPrices, 30000);
}
client.login(config.token);