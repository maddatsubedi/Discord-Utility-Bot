const { Events, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { appendToSheet, getSheetData, updateUserData, deleteSheet, checkSheetExists, createSheet } = require('../utils/sheetsUtils.js');
const { consultantRoleId, teamRoleId, supportRoleId } = require('../config.json');
const { checkRoles } = require('../utils/functions.js');

// console.log(musicCommandFiles);

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {

        if (!interaction.isButton()) {
            return;
        }

        const permCheck = await checkRoles(interaction.member, [consultantRoleId, teamRoleId, supportRoleId]);

        let customId = await interaction.customId;

        const configSheetName = `survey-config`;
        const configSheetRange = `A:F`;

        const sheetName = `surveys`;
        const range = 'A:G';

        if (!customId.startsWith("survey:")) {
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        const checkConfigSheet = await checkSheetExists(`survey-config`);
        if (!checkConfigSheet) {
            await interaction.editReply({ content: '> **The survey-config system is not found in the database.**\n```Please report this to the support team```', ephemeral: true });
            return;
        }
        const checkSheet = await checkSheetExists(`surveys`);
        if (!checkSheet) {
            await interaction.editReply({ content: '> **The survey system is not found in the database.**\n```Please report this to the support team```', ephemeral: true });
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
        const check = await fetchedData.find((row) => row[1] == interaction.channel.id);
        let closed;
        if (check) {
            closed = check[2] === 'closed';
        }

        if (closed) {
            await interaction.editReply({ content: '> **The survey system is closed.**\n```You can not vote as of now.```', ephemeral: true });
            return;
        }

        // await interaction.editReply('Pong!');

        const date = new Date().toUTCString();
        let vote = await interaction.customId.split(":")[1];
        const data = `${interaction.user.username},.,${interaction.user.id},.,${vote},.,${interaction.channel.name},.,${interaction.channel.id},.,${date},.,${`N/A`}`;

        await getSheetData(sheetName, range)
            .then((data) => {
                // console.log('Data fetched successfully.');
                fetchedData = data;
                // You can access and process the fetched data here
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });

        const user = await fetchedData.find((row) => row[1] == interaction.user.id);

        const errEmbed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(`You cannot submit this survey as you have already submitted it.`)

        if (user) {
            await interaction.editReply({ embeds: [errEmbed] });
            return;
        }

        // console.log(interaction.message.embeds);

        const actionRow1 = interaction.message.components[0];
        const actionRow2 = interaction.message.components[1];
        let button = await interaction.customId.split(":")[1];
        button = parseInt(button);

        // console.log(button);

        // console.log(actionRow1.components[button]);


        if (button <= 5) {
            const btnI = button - 1;
            // console.log("Hello");
            let label = actionRow1.components[btnI].data.label
            let labelValue = label.split(":")[1].trim();
            labelValue = parseInt(labelValue);
            if (button == 1) actionRow1.components[btnI].data.label = `1️⃣ : ${labelValue + 1}`;
            if (button == 2) actionRow1.components[btnI].data.label = `2️⃣ : ${labelValue + 1}`;
            if (button == 3) actionRow1.components[btnI].data.label = `3️⃣ : ${labelValue + 1}`;
            if (button == 4) actionRow1.components[btnI].data.label = `4️⃣ : ${labelValue + 1}`;
            if (button == 5) actionRow1.components[btnI].data.label = `5️⃣ : ${labelValue + 1}`;
            // console.log(button);
            // console.log(button + 1); 6 0, 7 1, 8 2, 9 3, 10 4
        } else if (button >= 6) {
            const btnI = button - 6;
            let label = actionRow2.components[btnI].data.label;
            let labelValue = label.split(":")[1].trim();
            labelValue = parseInt(labelValue);
            if (button == 6) actionRow2.components[btnI].data.label = `6️⃣ : ${labelValue + 1}`;
            if (button == 7) actionRow2.components[btnI].data.label = `7️⃣ : ${labelValue + 1}`;
            if (button == 8) actionRow2.components[btnI].data.label = `8️⃣ : ${labelValue + 1}`;
            if (button == 9) actionRow2.components[btnI].data.label = `9️⃣ : ${labelValue + 1}`;
            if (button == 10) actionRow2.components[btnI].data.label = `🔟 : ${labelValue + 1}`;
        }

        // await interaction.channel.send({ embeds: [embed], components: [actionRow1, actionRow2] });
        await interaction.message.edit({ components: [actionRow1, actionRow2] });

        const successEmbed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`You have successfully submitted the survey.`)

        await interaction.editReply({ embeds: [successEmbed] });

        await appendToSheet(sheetName, range, data)
            .then(() => {
                // console.log('Data appended successfully.');
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });
    },
};