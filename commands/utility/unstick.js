const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const { appendToSheet, getSheetData, updateUserData, deleteSheet, createSheet, checkSheetExists, deleteRowByChannelId } = require('../../utils/sheetsUtils.js');
const wait = require('node:timers/promises').setTimeout;
const { role1Id, role2Id, role3Id } = require('../../config.json');
const { checkRoles } = require('../../utils/functions.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unstick')
        .setDescription('Unstick a message in the channel')
        .addChannelOption(option => option.setName('channel').setDescription('The channel where the sticky message in').addChannelTypes(ChannelType.GuildText).setRequired(true)),
    // .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {

        const permCheck = await checkRoles(interaction.member, [role1Id, role2Id, role3Id]);
        if (!permCheck) {
            await interaction.reply({ content: '> **You cannot use this command.**\n```You do not have the permission to use this.```', ephemeral: true });
            return;
        }

        const channel = interaction.options.getChannel('channel');

        await interaction.deferReply({ ephemeral: true });
        
        const sheetName = 'sticky message';
        const range = 'A:D';

        const checkSheet = await checkSheetExists('sticky message');

        if (!checkSheet) {
            await interaction.editReply({ content: '> **Database not found**\n```Please check the google sheets and make sure there is a sheet named \'sticky message\'```' });
            return;
        }

        let fetchedData;
        await getSheetData(sheetName, range)
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

        if (!check) {
            await interaction.editReply({ content: `> **There is no sticky message in the channel**\n\`\`\`If you want to delete the message, kindly delete it manually\`\`\`` });
            return;
        }

        // wait(5000).then(() => {
        //     sentMsg.delete();
        // }).catch(console.error);
        // Example usage:
        await deleteRowByChannelId(sheetName, channel.id);


        await interaction.editReply({ content: `> **The message is successfully unsticked in ${channel}.**\n\`\`\`To stick a message, kindly use the /stick command.\`\`\``, ephemeral: true });

    },
};