const { PermissionsBitField, EmbedBuilder, ChannelType, ActionRowBuilder, SlashCommandBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const { appendToSheet, getSheetData, updateUserData, deleteSheet, createSheet, checkSheetExists } = require('../../utils/sheetsUtils.js');
const { role1Id, role2Id, role3Id } = require('../../config.json');
const { checkRoles } = require('../../utils/functions.js');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('survey')
        .setDescription('This sets up the survey system')
        .addChannelOption(option => option.setName('channel').setDescription('The channel you want to send the survey message in').addChannelTypes(ChannelType.GuildText).setRequired(true)),
    async execute(interaction) {

        const permCheck = await checkRoles(interaction.member, [role1Id, role2Id, role3Id]);
        if (!permCheck) {
            await interaction.reply({ content: '> **You cannot use this command.**\n```You do not have the permission to use this.```', ephemeral: true });
            return;
        }
        
        const channel = interaction.options.getChannel('channel');

        await interaction.deferReply({ ephemeral: true });

        const checkSheet = await checkSheetExists(`surveys-${channel.id}`);
        // console.log(checkSheet);

        if (checkSheet) {
            await interaction.editReply({ content: `Survey system is already active in this channel. Please delete the existing survey post in the channel ${channel}.\n\`\`\`If you had already deleted the survey post, kindly try deleting the existing sheet named 'surveys-${channel.id}' on google sheet.\`\`\`` });
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
        
        
        const survey =  await channel.send({ embeds: [embed], components: [row1, row2] });
        const headers = ['User', 'User ID', 'Channel', 'Channel ID', 'Vote', 'Date', 'Remarks', survey.id];
        await createSheet(`surveys-${channel.id}`, headers);
        await interaction.editReply({ content: `Survey System has been set up in ${channel}.` });
        
    }
}