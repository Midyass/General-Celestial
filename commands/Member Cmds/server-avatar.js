const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const cooldowns = new Map(); 
const COOLDOWN_TIME = 5000;

module.exports = {
    name: 'serveravatar',
    aliases: ['sa'],
    description: 'Displays the server avatar (icon).',
    async execute(message) {
 
        console.log(`Checking cooldown for ${message.author.id}`); 
        if (cooldowns.has(message.author.id)) {
            console.log(`${message.author.id} is on cooldown!`); 
            return message.react('⏳'); 
        }

        cooldowns.set(message.author.id, Date.now() + COOLDOWN_TIME);
        setTimeout(() => cooldowns.delete(message.author.id), COOLDOWN_TIME);

        const guild = message.guild;

        const serverAvatar = guild.iconURL({ dynamic: true, size: 1024 });

        if (serverAvatar) {
            const avatarEmbed = new EmbedBuilder()
                .setColor('#00f5ff') 
                .setAuthor({ name: `${message.author.tag}'s Server Avatar`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setURL(serverAvatar) 
                .setImage(serverAvatar)
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            const downloadButton = new ButtonBuilder()
                .setLabel('Download Avatar')
                .setStyle(ButtonStyle.Link)  
                .setURL(serverAvatar); 

            const row = new ActionRowBuilder().addComponents(downloadButton);

            await message.reply({ embeds: [avatarEmbed], components: [row] });
        } else {
            const noAvatarEmbed = new EmbedBuilder()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }), })
                .setColor('Yellow') 
                .setDescription('<:warning_26a0fe0f:1335402182177984654> This server does not have an avatar set.');

            await message.reply({ embeds: [noAvatarEmbed] });
        }
    }
};
