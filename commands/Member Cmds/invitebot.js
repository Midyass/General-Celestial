const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const cooldowns = new Map(); 
const COOLDOWN_TIME = 5000; 

module.exports = {
    name: 'invite',
    aliases: ["invites","invitebot",],
    aliases: ['Celestail','support','celestail','invitebot'],
    description: 'Get the bot\'s invite link.',
    async execute(message) {
        if (cooldowns.has(message.author.id)) {
            return message.react('⏳'); 
        }

        cooldowns.set(message.author.id, Date.now() + COOLDOWN_TIME);
        setTimeout(() => cooldowns.delete(message.author.id), COOLDOWN_TIME);

        const inviteLink = 'https://discord.com/oauth2/authorize?client_id=1344766565387866163&permissions=8&scope=bot';

        const user = message.mentions.users.first() || message.author;

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setAuthor({ name: 'Bot Invite Link', iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setDescription('**__Click the buttons below to invite the bot to your server or visit the [support server!](https://discord.gg/kYJnSKFa3U)__**');

        const inviteButton = new ButtonBuilder()
            .setLabel('・Add Bot') 
            .setEmoji('1342488003817246804') 
            .setStyle(ButtonStyle.Link)
            .setURL(inviteLink);

        const supportButton = new ButtonBuilder()
            .setLabel('・Support Server')
            .setEmoji('<:c_:1342488003817246804>')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.gg/kYJnSKFa3U'); 

        const row = new ActionRowBuilder().addComponents(inviteButton, supportButton);

        message.reply({ embeds: [embed], components: [row] });
    }
};
