const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const { appendToSheet, getSheetData, updateUserData, deleteSheet, createSheet, checkSheetExists } = require('../../utils/sheetsUtils.js');
const wait = require('node:timers/promises').setTimeout;
const { consultantRoleId, teamRoleId, supportRoleId } = require('../../config.json');
const { checkRoles } = require('../../utils/functions.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stick')
        .setDescription('Stick a message to the channel')
        .addChannelOption(option => option.setName('channel').setDescription('The channel you want to send the sticky message in').addChannelTypes(ChannelType.GuildText).setRequired(true))
        .addStringOption(option => option.setName('message-link').setDescription('The message link').setRequired(true)),
    // .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {

        const permCheck = await checkRoles(interaction.member, [consultantRoleId, teamRoleId, supportRoleId]);
        if (!permCheck) {
            await interaction.reply({ content: '> **You cannot use this command.**\n```You do not have the permission to use this.```', ephemeral: true });
            return;
        }

        const channel = interaction.options.getChannel('channel');
        const messageId = interaction.options.get('message-link').value;

        await interaction.deferReply({ ephemeral: true });

        const ids = await messageId.match(/\d+/g);

        if (!ids) {
            await interaction.editReply({ content: '> **Message link is not valid.**\n```Please use the valid message link.```', ephemeral: true });
            return;
        }

        const message = await interaction.guild.channels.cache.get(ids[1])?.messages.fetch(ids[2]).catch(err => null) ?? null;

        if (!message) {
            await interaction.editReply({ content: '> **Message not found.**\n```Please use this command in the channel where the original message is.```', ephemeral: true });
            return;
        }

        const sheetName = 'sticky message';
        const range = 'A:D';
        const date = new Date().toUTCString();

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

        if (check) {
            await interaction.editReply({ content: `> **Sticky message is already in the channel**\n\`\`\`Please unstick the current channel by using /unstick command or delete the row containing the Channel ID ${channel.id}\`\`\`` });
            return;
        }

        let embeds = message.embeds;
        let content = message.content;

        if (embeds.length == 0 && content.length == 0) {
            await interaction.editReply({ content: `> **Error**\n\`\`\`There is no content or embed in the message.\`\`\``, ephemeral: true });
            return;
        }

        if (embeds.length == 0) {
            embeds[0] = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
                .setColor('Random')
                .setDescription(`**${content}**`)
                .setFooter({ text: 'Sticky Message'} )
            content = null;
        }

        const sentMsg = await channel.send({ content: content, embeds: embeds });

        const data = `${channel.name},.,${channel.id},.,${sentMsg.id},.,${date}`;

        await appendToSheet(sheetName, range, data)
            .then(() => {
                // console.log('Data appended successfully.');
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });

        await interaction.editReply({ content: `> **The message is successfully sticked in ${channel}.**\n\`\`\`This sticy message will be sticked in the channel for 24 hrs.\`\`\``, ephemeral: true });

    },
};