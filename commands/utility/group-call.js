const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { consultantRoleId, teamRoleId, supportRoleId } = require('../../config.json');
const { checkRoles } = require('../../utils/functions.js');
let isBotWorking = false;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('group-call')
        .setDescription('Invite users for group call.')
        .addRoleOption(option => option.setName('role').setDescription('The role to send invite').setRequired(true)),
    // .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {

        const permCheck = await checkRoles(interaction.member, [consultantRoleId, teamRoleId, supportRoleId]);
        if (!permCheck) {
            await interaction.reply({ content: '> **You cannot use this command.**\n```You do not have the permission to use this.```', ephemeral: true });
            return;
        }
        // Check if the bot is already working
        if (isBotWorking) {
            interaction.reply("The bot is already sending DMs. Please wait until it finishes.");
            return;
        }

        // Set the bot to be working
        isBotWorking = true;

        const targetRole = interaction.options.get('role').value;
        const message = `Hey there, the Collins Ecom Q&A group call is starting very soon here! Please find your way into the voice channel section on our server & prepare as many questions as possible!`;
        const targetRoleName = interaction.options.get('role').role.name;

        let userCount = 0;
        await interaction.guild.members.cache.forEach(async (member) => {
            if (member.roles.cache.has(targetRole)) {
                userCount += 1;
            }
        });

        if (!userCount) {
            const DMSsnInfoEmbed = new EmbedBuilder()
                .setTitle('DMs Session Info')
                .setColor(0xff0000)
                .setDescription(`No members with role \`${targetRoleName}\` in the server.`)
                .setTimestamp();
            await interaction.reply({ embeds: [DMSsnInfoEmbed] });
            isBotWorking = false;
            return;
        }

        const preDMSsnInfoEmbed = new EmbedBuilder()
            .setTitle('DMs Session Info')
            .setColor(0xFFA500)
            .setDescription(`Sending invite to ${userCount} members`)
            .addFields(
                { name: `> **\`Role\`**`, value: `> ${targetRoleName}` },
                { name: `> **\`Message\`**`, value: `> ${message}` },
                { name: `> **\`Members\`**`, value: `> ${userCount}` },
            )
            .setTimestamp();
        await interaction.reply({ embeds: [preDMSsnInfoEmbed] });

        let sentMembersCount = 0;

        const members = interaction.guild.members.cache;

        const dmEmbed = new EmbedBuilder()
            .setTitle(interaction.guild.name)

        for (const [_, member] of members) {
            if (member.roles.cache.has(targetRole)) {
                if (!member.user.bot) {
                    // console.log(member);
                    dmEmbed.setTitle(`${interaction.guild.name}`);
                    dmEmbed.setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.avatarURL() });
                    dmEmbed.setColor('Random');
                    dmEmbed.setDescription(`> **Hey there ${member}, the Collins Ecom Q&A group call is starting very soon here! Please find your way into the voice channel section on our server & prepare as many questions as possible!**`);
                    await member.send({ embeds: [dmEmbed] }).catch(() => sentMembersCount -= 1);
                    sentMembersCount += 1;
                }
            }
        }

        const DMSsnInfoEmbed = new EmbedBuilder()
            .setTitle('DMs Session Info')
            .setColor(0x00FF00)
            .setDescription(`Invite successfully sent to ${sentMembersCount} members out of ${userCount} members with role \`${targetRoleName}\``)
            .setTimestamp();
        await interaction.channel.send({ embeds: [DMSsnInfoEmbed] });
        isBotWorking = false;
    },
};