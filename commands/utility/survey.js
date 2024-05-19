const { PermissionsBitField, EmbedBuilder, ChannelType, ActionRowBuilder, SlashCommandBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const { appendToSheet, getSheetData, updateUserData, deleteSheet, createSheet, checkSheetExists } = require('../../utils/sheetsUtils.js');
const { consultantRoleId, teamRoleId, supportRoleId } = require('../../config.json');
const { checkRoles } = require('../../utils/functions.js');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('survey')
        .setDescription('This sets up the survey system')
        .addChannelOption(option => option.setName('channel').setDescription('The channel you want to send the survey message in').addChannelTypes(ChannelType.GuildText).setRequired(true)),
    async execute(interaction) {

        const permCheck = await checkRoles(interaction.member, [consultantRoleId, teamRoleId, supportRoleId]);
        if (!permCheck) {
            await interaction.reply({ content: '> **You cannot use this command.**\n```You do not have the permission to use this.```', ephemeral: true });
            return;
        }

        const channel = interaction.options.getChannel('channel');

        await interaction.deferReply({ ephemeral: true });

        const checkSheet = await checkSheetExists(`surveys`);

        const configSheetName = `survey-config`;
        const configSheetRange = `A:F`;

        if (!checkSheet) {
            await interaction.editReply({ content: `Survey system is not found in the database}.\n\`\`\`Please craete a sheet named 'surveys' on google sheet.\`\`\`` });
            return;
        }

        let fetchedData;
        await getSheetData(configSheetName, configSheetRange)
            .then((data) => {
                // console.log('Data fetched successfully.');
                fetchedData = data;
                // You can access and process the fetched data here
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });
        // console.log(fetchedData);
        const check = await fetchedData.find((row) => row[1] == channel.id);

        if (check) {
            await interaction.editReply({ content: '> **The survey system is already in this channel.**\n```Please delete the existing survey to create a new survey.```', ephemeral: true });
            return;
        }
        // if (!checkSheet) {
        // }

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle(`How do you like our service so far ? Please also provide any additional feedback on how we can improve your experience with us! `)
            .setDescription(`**maxchoices : 10**\n\n>>>  1️⃣ 1\n 2️⃣ 2\n 3️⃣ 3\n 4️⃣ 4\n 5️⃣ 5\n 6️⃣ 6\n 7️⃣ 7\n 8️⃣ 8\n 9️⃣ 9\n🔟 10`)
            .setFooter({ text: `${interaction.guild.name} surveys` })

        const one = new ButtonBuilder()
            .setCustomId('survey:1')
            .setLabel('1️⃣ : 0')
            .setStyle(ButtonStyle.Secondary);

        const two = new ButtonBuilder()
            .setCustomId('survey:2')
            .setLabel('2️⃣ : 0')
            .setStyle(ButtonStyle.Secondary);

        const three = new ButtonBuilder()
            .setCustomId('survey:3')
            .setLabel('3️⃣ : 0')
            .setStyle(ButtonStyle.Secondary);

        const four = new ButtonBuilder()
            .setCustomId('survey:4')
            .setLabel('4️⃣ : 0')
            .setStyle(ButtonStyle.Secondary);

        const five = new ButtonBuilder()
            .setCustomId('survey:5')
            .setLabel('5️⃣ : 0')
            .setStyle(ButtonStyle.Secondary);

        const six = new ButtonBuilder()
            .setCustomId('survey:6')
            .setLabel('6️⃣ : 0')
            .setStyle(ButtonStyle.Secondary);

        const seven = new ButtonBuilder()
            .setCustomId('survey:7')
            .setLabel('7️⃣ : 0')
            .setStyle(ButtonStyle.Secondary);

        const eight = new ButtonBuilder()
            .setCustomId('survey:8')
            .setLabel('8️⃣ : 0')
            .setStyle(ButtonStyle.Secondary);

        const nine = new ButtonBuilder()
            .setCustomId('survey:9')
            .setLabel('9️⃣ : 0')
            .setStyle(ButtonStyle.Secondary);

        const ten = new ButtonBuilder()
            .setCustomId('survey:10')
            .setLabel('🔟 : 0')
            .setStyle(ButtonStyle.Secondary);

        const row1 = new ActionRowBuilder()
            .addComponents(one, two, three, four, five);

        const row2 = new ActionRowBuilder()
            .addComponents(six, seven, eight, nine, ten);


        const survey = await channel.send({ embeds: [embed], components: [row1, row2] });
        const date = new Date().toUTCString();
        const data = `${channel.name},.,${channel.id},.,open,.,${date},.,${survey.id},.,N/A`;
        await appendToSheet(`survey-config`, 'A:D', data)
            .then(() => {
                // console.log('Data appended successfully.');
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });
        await interaction.editReply({ content: `Survey System has been set up in ${channel}.` });

    }
}