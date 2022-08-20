const
{
	SlashCommandBuilder,
	ComponentType,
	SelectMenuBuilder,
	ActionRowBuilder,
	EmbedBuilder,
	ButtonBuilder,
	GuildMember
} = require('discord.js');

const db = require('../handlers/database.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('color')
		.setDescription('Assign yourself a color'),
	async execute(interaction)
	{
		const guildID = interaction.guild.id;

		var query = `SELECT "UID" FROM "${guildID}" WHERE "UIDType"='rolecolor';`;
		var roles = [];
		try
		{
			roles = await db.query(query);
		}
		catch (e)
		{
			console.error(`An error occured: ${e}`);
		}

		roles = roles.rows;
		if (roles.length == 0)
		{

			await interaction.reply(
			{
				content: "No color roles set.",
				ephemeral: true
			})
		}
		else
		{
			const options = [];
			const roleNames = [];
			const roleIDs = [];
			for (const element of roles)
			{
				var uid = element.UID;
				if (interaction.guild.roles.cache.find(x => x.id == uid) == undefined ||
					element == interaction.guild.id)
				{
					var query = `INSERT INTO "${guildID}" ("UID", "UIDType") 
                    VALUES(${uid}, 'none')
                    ON CONFLICT ("UID") DO UPDATE
                    SET "UID" = ${uid}, "UIDType" = 'none'`;
					db.query(query, (err) =>
					{
						if (err != undefined) console.log(err);
					});
				}
				else
				{
					options.push(
					{
						label: interaction.guild.roles.cache.get(`${uid}`).name,
						value: uid
					})
					roleNames.push("<@&" + uid + ">\n");
					roleIDs.push(uid);
				}
			}
			const menuPages = [];
			const embedPages = [];
			var totalPages = Math.ceil(roleNames.length / 20);
			var i = 1;
			while (i <= totalPages)
			{

				var rolePages = [];
				var optionPages = []
				var j = 0;
				while (j < 20 && roleNames.length > 0)
				{
					rolePages.push(roleNames[0]);
					roleNames.shift();
					optionPages.push(options[0]);
					options.shift();
					j++;
				}
				const menu = new ActionRowBuilder()
					.addComponents(
						new SelectMenuBuilder()
						.setCustomId('select')
						.setPlaceholder('Select your color role')
						.addOptions(optionPages),
					);
				const roleEmbed = new EmbedBuilder()
					.setColor("#000000")
					.setTitle("Use the menu to choose the role you want")
					.setThumbnail(interaction.client.user.displayAvatarURL(
					{
						dynamic: true,
						size: 1024
					}))
					.setDescription(rolePages.join(""))
					.setFooter(
					{
						text: "Page " + i + "/" + totalPages
					});
				embedPages.push(roleEmbed);
				menuPages.push(menu);
				i++;
			}
			const previousbtn = new ButtonBuilder()
				.setCustomId('previousbtn')
				.setLabel('Previous')
				.setStyle('Primary')
				.setDisabled(false);

			const nextbtn = new ButtonBuilder()
				.setCustomId('nextbtn')
				.setLabel('Next Page')
				.setStyle('Primary')
				.setDisabled(false);
			const buttonRow = new ActionRowBuilder()
				.addComponents(previousbtn, nextbtn);
			var page = 0;
			const currPage = await interaction.reply(
			{
				embeds: [embedPages[0]],
				components: [buttonRow, menuPages[0]],
				fetchyReply: true,
				ephemeral: true
			})
			const btnCollector = currPage.createMessageComponentCollector(
			{
				componentType: ComponentType.Button,
				time: 15000
			});
			const menuCollector = currPage.createMessageComponentCollector(
			{
				componentType: ComponentType.SelectMenu,
				time: 15000
			});
			btnCollector.on('collect', async i =>
			{
				switch (i.customId)
				{
				case 'previousbtn':
					page = page > 0 ? --page : embedPages.length - 1;
					break;
				case 'nextbtn':
					page = page + 1 < embedPages.length ? ++page : 0;
					break;
				default:
					break;
				}
				await i.deferUpdate();
				await i.editReply(
				{
					embeds: [embedPages[page]],
					components: [buttonRow, menuPages[page]],
				});
				btnCollector.resetTimer();
				menuCollector.resetTimer();
			});

			btnCollector.on('end', async reason =>
			{
				await interaction.editReply(
				{
					content: "Run /color again if you'd like to restart.",
					embeds: [],
					components: []
				});
			});

			menuCollector.on('collect', async i =>
			{
				await i.deferUpdate();
				await i.editReply(
				{
					content: "You've been given the role: <@&" + i.values + ">",
					embeds: [],
					components: []
				});
				var guildMember = await interaction.guild.members.fetch(interaction.user.id);
				for (currRoleID of roleIDs)
				{
					if (guildMember.roles.cache.has(currRoleID) && currRoleID != i.values)
					{
						await guildMember.roles.remove([currRoleID])
					}
				}
				await guildMember.roles.add(i.values);
				btnCollector.resetTimer();
				menuCollector.resetTimer();
			});
		}
	},
};