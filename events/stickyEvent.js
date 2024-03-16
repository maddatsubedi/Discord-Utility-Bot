const { Events } = require('discord.js');
const { appendToSheet, getSheetData, checkSheetExists, updateSheetData, deleteRowByChannelId } = require('../utils/sheetsUtils.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // const toChannel = await message.client.channels.fetch(levelChannelId);
        if (!message.inGuild() || message.author.bot) return;

        const sheetName = 'sticky message';
        const range = 'A:D';
        const date = new Date().toUTCString();

        const checkSheet = await checkSheetExists('sticky message');

        if (!checkSheet) {
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
        const check = await fetchedData.find((row) => row[1] == message.channel.id);
        if (!check) {
            return;
        }

        const storedDateObj = new Date(fetchedData[0][3]);
        const currentDate = new Date();
        const diffInMilliseconds = currentDate - storedDateObj;
        const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
        const isWithin24Hours = diffInHours <= 24;
        
        if (!isWithin24Hours) {
            await deleteRowByChannelId(sheetName, message.channel.id);
            return;
        }
        
        const stickyMessage = await message.guild.channels.cache.get(check[1])?.messages.fetch(check[2]).catch(err => null) ?? null;

        if (!stickyMessage) return;

        await stickyMessage.delete();

        const sentMessage = await message.channel.send({ embeds: stickyMessage.embeds });

        await updateSheetData(sheetName, stickyMessage.id, sentMessage.id);

    }
};
