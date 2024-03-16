const { PermissionsBitField, EmbedBuilder, ChannelType, ActionRowBuilder, SlashCommandBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const { appendToSheet, getSheetData, updateUserData, deleteSheet, createSheet, checkSheetExists } = require('../../utils/sheetsUtils.js');
const { role1Id, role2Id, role3Id } = require('../../config.json');
const { checkRoles } = require('../../utils/functions.js');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('survey-close')
        .setDescription('This closes the survey system')
        .addChannelOption(option => option.setName('channel').setDescription('The channel where survey message in').addChannelTypes(ChannelType.GuildText).setRequired(true)),
    async execute(interaction) {

        const permCheck = await checkRoles(interaction.member, [role1Id, role2Id, role3Id]);
        if (!permCheck) {
            await interaction.reply({ content: '> **You cannot use this command.**\n```You do not have the permission to use this.```', ephemeral: true });
            return;
        }

        const channel = interaction.options.getChannel('channel');

        await interaction.deferReply({ ephemeral: true });

        const data = `closed,.,closed,.,closed,.,closed,.,closed,.,closed,.,closed`;

        const checkSheet = await checkSheetExists(`surveys-${channel.id}`);
        if (!checkSheet) {
            await interaction.editReply({ content: '> **The survey system is not found in the database.**\n```Please delete the survey post manually```', ephemeral: true });
            return;
        }

        // console.log(fetchedData);
        let fetchedData;
        await getSheetData(`surveys-${channel.id}`, 'A:G')
            .then((data) => {
                // console.log('Data fetched successfully.');
                fetchedData = data;
                // You can access and process the fetched data here
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });
        const check = await fetchedData.find((row) => row[5] == 'closed');

        let closed;
        if (check) {
            closed = check.every(element => element === 'closed');
        }

        if (closed) {
            await interaction.editReply({ content: '> **The survey system is already closed.**\n```You can see the votes on google sheets.```', ephemeral: true });
            return;
        }

        await appendToSheet(`surveys-${channel.id}`, 'A:G', data)
            .then(() => {
                // console.log('Data appended successfully.');
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });

        await interaction.editReply({ content: '> **The survey system is closed successfully.**\n```You can use /survey to create new survey post.```', ephemeral: true });


    }
}