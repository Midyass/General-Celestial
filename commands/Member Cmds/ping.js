const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const cooldowns = new Map(); 
const COOLDOWN_TIME = 5000; 
const SUPPORT_SERVER = "https://discord.gg/kYJnSKFa3U"; 

module.exports = {
    name: 'ping',
    aliases: ['p'],
    description: 'Checks the bot\'s ping, API latency, and uptime.',
    async execute(message) {

        if (cooldowns.has(message.author.id)) {
            return message.react('⏳'); 
        }

        cooldowns.set(message.author.id, Date.now() + COOLDOWN_TIME);
        setTimeout(() => cooldowns.delete(message.author.id), COOLDOWN_TIME);

        const botPing = Date.now() - message.createdTimestamp;
        const apiPing = Math.round(message.client.ws.ping);

        const uptime = process.uptime();
        const days = Math.floor(uptime / (24 * 60 * 60));
        const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((uptime % (60 * 60)) / 60);
        const seconds = Math.floor(uptime % 60);

        const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        const embed = new EmbedBuilder()
            .setColor('Green')
            .addFields(
                { name: 'Bot Latency', value: `\`\`\`yaml\n${botPing}ms\`\`\``, inline: true },
                { name: 'Uptime', value: `\`\`\`yaml\n${uptimeString}\`\`\``, inline: true },
                { name: 'Developers', value: `\`\`\`yaml\nCelestial Team\`\`\``, inline: true }
            );

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("・Support Server")
                .setURL(SUPPORT_SERVER)
                .setEmoji("<:c_:1342488003817246804>")
                .setStyle(ButtonStyle.Link)
        );

        await message.reply({ embeds: [embed], components: [row] });
    },
};
