const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const db = require('../handlers/database.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('addsar')
		.setDescription('Set as a self-assignable roles')
        .addStringOption(option => option.setName('roles').setDescription('Tag each role or enter the ID'))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction) {
        const guildID = interaction.guild.id;
        if(!interaction.options.getString('roles')) {
            await interaction.reply({content:` Please enter the Role IDs with spaces in between if multiple.`, ephemeral: true})
        } else {
            var roles = interaction.options.getString('roles').split(' ').filter(x => x).map( x => BigInt(x.replace(/\D+/g,'')));
            var rolesAdded = [];
            var rolesFailed = [];
            if(roles.length < 1) {
                await interaction.reply({content:`Please enter the Role IDs with spaces in between if multiple.`, ephemeral: true})
            } else {
                if (roles.length < 51) {
                    for (const element of roles) {
                        if (interaction.guild.roles.cache.find(x => x.id == element) == undefined 
                        || element == interaction.guild.id)
                        {
                            rolesFailed.push(element);
                        } else {
                            var query = `
                            INSERT INTO "${guildID}" ("UID", "UIDType") 
                            VALUES(${element}, 'rolesa')
                            ON CONFLICT ("UID") DO UPDATE
                            SET "UID" = ${element}, "UIDType" = 'rolesa';`;
                            db.query(query, (err) => {
                                if(err != undefined) console.log(err);
                            });
                            rolesAdded.push(`<@&${element}>`);
                        }
                    }
                    var reply = `Set as SAR roles: ${rolesAdded}\nFailed: ${rolesFailed}`;
                    await interaction.reply({content: reply, ephemeral: true});
                } else {
                    await interaction.reply({content:`Please enter a maximum of 50 roles at once.`, ephemeral: true})

                }
            }
        }

	},
};