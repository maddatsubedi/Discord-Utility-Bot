const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { role1Id, role2Id, role3Id } = require('../../config.json');
const { checkRoles } = require('../../utils/functions.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('onboard')
        .setDescription('Onboards new clients into private discord channels.')
        .addUserOption(option => option.setName('member').setDescription('The member to onboard').setRequired(true)),
    // .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {

        const permCheck = await checkRoles(interaction.member, [role1Id, role2Id, role3Id]);
        if (!permCheck) {
            await interaction.reply({ content: '> **You cannot use this command.**\n```You do not have the permission to use this.```', ephemeral: true });
            return;
        }


        const member = await interaction.options.getMember('member');

        await interaction.deferReply({ ephemeral: true });

        // console.log(interaction.guild.iconURL());
        // return;

        const welcomeEmbed = new EmbedBuilder()
            .setColor('Random')
            .setAuthor({ name: `${member.user.username}`, iconURL: member.user.avatarURL() })
            .setDescription(`**Wohooo! Congratulations & welcome to the partnership program!!! 🚀🔥 Your consultant will be online soon & introduce themselves. Inside this channel, you now have direct access to your designated consultant, web designer, UGC creator, private fulfillment agent, accountability partner & Collins Ecom directly.**\n\n**\`\`\`Please note that during this new exciting journey ahead, the value you receive will be determined by the questions you ask. If you do not ask us lots of questions, we cannot give you lots of value. You will be responsible for driving this venture forward, and we are here to help you with every single step along the way!\`\`\`**`)
            .setTimestamp()
            .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() });

        const welcomeEmbed1 = new EmbedBuilder()
            .setColor('Random')
            .setDescription(`**Moving forward, please make sure to utilize your partnership blueprint. Our consultants will send this over to you via email soon. This will include a task system you will use to stay on track & follow our path. Please move these tasks from ‘to do’ → ‘in progress’ → ‘complete’ as you go through this journey so that we can keep track of your progress. We have built an amazing streamlined system to get you profiting faster than any other program or solution out there… seriously. So, make sure to take full advantage of every single day you're inside our program & remember to ask us as many questions as humanly possible! Our consultants have done multiple 6-7 figures with dropshipping, take full advantage of this knowledge!**`)

        const infoEmbed = new EmbedBuilder()
            .setDescription(`**Here is a rundown of everything provided for the next few months:**`)

        const embed1 = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`Daily 1on1 Consulting`)
            .setDescription(`**\n> Weekly private zoom calls with your consultant\n\n> Daily personalized 1on1 guidance through discord\n\n> 2 weekly group calls with our community**`)
            .setImage('https://time-albatross-921.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F1c37139f-4784-412e-91ad-6eca706111bd%2F1d365216-10b1-43bf-9a8e-be25d118780c%2FUntitled_(1200__1000_px)_(1200__800_px)_(1234200__700_px).png?table=block&id=c8c3ea95-acdb-4a81-a949-47905f092962&spaceId=1c37139f-4784-412e-91ad-6eca706111bd&width=2000&userId=&cache=v2')
            .setTimestamp()
            .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() });

        const embed2 = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`High Level Contacts`)
            .setDescription(`**\n> Our product research team will do the heavy lifting FOR YOU. You will receive our top product picks for the month.\n\n> We’ll also show you how to do proper product research & take you through the whole process**`)
            .setImage('https://time-albatross-921.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F1c37139f-4784-412e-91ad-6eca706111bd%2Fc72286aa-5f9b-4672-850e-b9d39668a5b2%2FCD_case_with_changeable_color_Copy_of_Copy_of_Copy_of_Copy_o21f_Copy_of_PROFITS_FIRST_COURSE_(1200__800_px)_(1200__600_px)_(1200__700_px)_(200__700_px)_(900__1200_px)_(900__1300_px)_(750__1600_px)_(1000__1200.png?table=block&id=fe2c5c85-ff8f-4c51-af50-a9c6b53a51d7&spaceId=1c37139f-4784-412e-91ad-6eca706111bd&width=2000&userId=&cache=v2')
            .setTimestamp()
            .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() });

        const embed3 = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`Done For You Website Development`)
            .setDescription(`**\n> Our web design team will build out a fully customized shopify store for YOUR specific product (not a pre-built). \n\n> Web design, plugins, copywriting, branding, settings, pricing, etc… ALL included with your store.**`)
            .setImage('https://time-albatross-921.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F1c37139f-4784-412e-91ad-6eca706111bd%2F45a38f65-4ec7-4725-bb20-79b521d450aa%2FCopy_of_Copy_of_Untitled_Dewefwfsign.png?table=block&id=1502a67a-494d-421d-85d5-cdd1a4746797&spaceId=1c37139f-4784-412e-91ad-6eca706111bd&width=2000&userId=&cache=v2')
            .setTimestamp()
            .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() });

        const embed4 = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`Customized 7-Page Marketing Plan`)
            .setDescription(`**\n> A full 7-page marketing plan to give you an in-depth understanding to how you're going to advertise this product.**`)
            .setImage('https://time-albatross-921.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F1c37139f-4784-412e-91ad-6eca706111bd%2Fb40a3d60-d9c9-459f-bb6f-3aa77ad66b5d%2FCopy_of_Untitled_Design_(43531).png?table=block&id=d7e787bd-be43-4787-a6b4-a7496a9b31ad&spaceId=1c37139f-4784-412e-91ad-6eca706111bd&width=2000&userId=&cache=v2')
            .setTimestamp()
            .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() });

        const embed5 = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`Done-With-You Advertising`)
            .setDescription(`**\n> Organic advertising utilizing our frameworks & organic content growth strategies.\n\n> Warm traffic ads that target people who’ve engaged with your organic content. \n\n> Cold traffic ads as the final stage in the process when we start to scale up!**`)
            .setImage('https://time-albatross-921.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F1c37139f-4784-412e-91ad-6eca706111bd%2F976b85a5-dd88-4262-8721-9f4343236d1c%2FiMac_in_2_colors_Copy_of_Copy_of_Copy_of_Copy_of_Copy_of_PROFITS_FIRST_COURSE_(1200__800_px)_(1200__600_px)_(1200_324_700_px)_(200__700_px)_(900__1200_px)_(900__1300_px)_(750__1600_px)_(1000__1200_px)_(1000__.png?table=block&id=cdca0799-4037-4068-886e-a3e4e086ea34&spaceId=1c37139f-4784-412e-91ad-6eca706111bd&width=2000&userId=&cache=v2')
            .setTimestamp()
            .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() });

        const embed6 = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`Daily 1on1 Consulting`)
            .setDescription(`**\n> Top 1% UGC creators: $50 /video instead of $100 - $300 /video (market standard)\n\n> Dropshipping agents that will drop your price down 20-40% (at scale) compared to traditional aliexpress suppliers.\n\n> Our in-house web design team, our payment processing agents, etc etc…**`)
            .setImage('https://time-albatross-921.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F1c37139f-4784-412e-91ad-6eca706111bd%2Fd2a26016-0298-41cd-bc83-c21dce2e276c%2FCopy_of_Untitled_Design_(2).png?table=block&id=dff7a7d8-57ee-4110-a69a-6cbc982e5741&spaceId=1c37139f-4784-412e-91ad-6eca706111bd&width=2000&userId=&cache=v2')
            .setTimestamp()
            .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() });


        let channel = await interaction.guild.channels.create({
            name: `welcome-${member.user.username}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: role1Id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: role2Id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: role3Id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: member.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
            ],
        })

        await channel.send(`${member}`);
        await channel.send({ embeds: [welcomeEmbed, welcomeEmbed1, infoEmbed, embed1, embed2, embed3, embed4, embed5, embed6] });

        await interaction.editReply(`Successfully onboarded ${member} in channel ${channel}`);
    },
};