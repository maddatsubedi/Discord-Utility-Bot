const { PermissionsBitField, EmbedBuilder, ChannelType, ActionRowBuilder, SlashCommandBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const { appendToSheet, getSheetData, updateUserData, updateSurveyData, deleteSheet, createSheet, checkSheetExists } = require('../../utils/sheetsUtils.js');
const { consultantRoleId, teamRoleId, supportRoleId } = require('../../config.json');
const { checkRoles } = require('../../utils/functions.js');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('survey-close')
        .setDescription('This closes the survey system')
        .addChannelOption(option => option.setName('channel').setDescription('The channel where survey message in').addChannelTypes(ChannelType.GuildText).setRequired(true)),
    async execute(interaction) {

        const permCheck = await checkRoles(interaction.member, [consultantRoleId, teamRoleId, supportRoleId]);
        if (!permCheck) {
            await interaction.reply({ content: '> **You cannot use this command.**\n```You do not have the permission to use this.```', ephemeral: true });
            return;
        }

        const channel = interaction.options.getChannel('channel');

        await interaction.deferReply({ ephemeral: true });

        const configSheetName = `survey-config`;
        const configSheetRange = `A:F`;

        const checkConfigSheet = await checkSheetExists(`survey-config`);
        if (!checkConfigSheet) {
            await interaction.editReply({ content: '> **The survey-config system is not found in the database.**\n```Please report this to the support team```', ephemeral: true });
            return;
        };

        const checkSheet = await checkSheetExists(`surveys`);
        if (!checkSheet) {
            await interaction.editReply({ content: '> **The survey system is not found in the database.**\n```Please delete the survey post manually```', ephemeral: true });
            return;
        }

        // console.log(fetchedData);
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
        const check = await fetchedData.find((row) => row[1] == interaction.channel.id);
        let closed;
        if (check) {
            closed = check[2] === 'closed';
        }

        if (closed) {
            await interaction.editReply({ content: '> **The survey system is already closed.**\n```You can see the votes on google sheets.```', ephemeral: true });
            return;
        }

        await updateSurveyData(configSheetName, 'open', 'closed');

        await interaction.editReply({ content: '> **The survey system is closed successfully.**\n```You can use /survey to create new survey post.```', ephemeral: true });


    }
}