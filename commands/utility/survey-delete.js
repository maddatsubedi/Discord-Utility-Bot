const { PermissionsBitField, EmbedBuilder, ChannelType, ActionRowBuilder, SlashCommandBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const { appendToSheet, getSheetData, getFullSheetData, updateUserData, deleteSheet, createSheet, checkSheetExists } = require('../../utils/sheetsUtils.js');
const { role1Id, role2Id, role3Id } = require('../../config.json');
const { checkRoles } = require('../../utils/functions.js');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('survey-delete')
        .setDescription('This deletes the survey system')
        .addChannelOption(option => option.setName('channel').setDescription('The channel where the survey message in').addChannelTypes(ChannelType.GuildText).setRequired(true)),
    async execute(interaction) {

        const permCheck = await checkRoles(interaction.member, [role1Id, role2Id, role3Id]);
        if (!permCheck) {
            await interaction.reply({ content: '> **You cannot use this command.**\n```You do not have the permission to use this.```', ephemeral: true });
            return;
        }

        const channel = interaction.options.getChannel('channel');

        await interaction.deferReply({ ephemeral: true });

        // await interaction.message.delete();
        const checkSheet = await checkSheetExists(`surveys-${channel.id}`);

        if (!checkSheet) {
            await interaction.editReply({ content: '> **The survey system is not found in the database.**\n```Please delete the survey post manually```', ephemeral: true });
            return;
        }

        let fetchedData;
        await getFullSheetData(`surveys-${channel.id}`, `A:H`)
            .then((data) => {
                // console.log('Data fetched successfully.');
                fetchedData = data;
                // You can access and process the fetched data here
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });
        // console.log(fetchedData);
        const messageId = await fetchedData[0][7];

        await deleteSheet(`surveys-${channel.id}`);

        const surveyMessage = await interaction.guild.channels.cache.get(channel.id)?.messages.fetch(messageId).catch(err => null) ?? null;

        if (!surveyMessage) {
            await interaction.editReply({ content: '> **The survey message is not found in this channel.**\n```Please delete the survey post manually```', ephemeral: true });
            return;
        }

        await surveyMessage.delete();

        // console.log(messageId);

        await interaction.editReply({ content: '```The survey post is successfully deleted.```', ephemeral: true });

    }
}