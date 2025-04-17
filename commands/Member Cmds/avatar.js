const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const cooldowns = new Map(); 
const COOLDOWN_TIME = 5000; 

module.exports = {
    name: 'avatar',
    description: 'Displays a user\'s avatar.',
    async execute(message, args) {
        
        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.author;

        if (cooldowns.has(message.author.id)) {
            return message.react('⏳');
        }

        cooldowns.set(message.author.id, Date.now() + COOLDOWN_TIME);
        setTimeout(() => cooldowns.delete(message.author.id), COOLDOWN_TIME);

        const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });

        const embed = new EmbedBuilder()
            .setColor('#00f5ff')
            .setAuthor({ name: `${user.tag}'s Avatar`, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setImage(avatarURL)
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Download Avatar')
                .setStyle(ButtonStyle.Link)
                .setURL(avatarURL) 
        );

        await message.reply({
            embeds: [embed],
            components: [row]
        });
    }
};
