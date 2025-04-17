const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const cooldowns = new Map();
const COOLDOWN_TIME = 5000; 

module.exports = {
    name: 'serverbanner',
    aliases: ['sb'],
    description: 'Displays the server banner.',
    async execute(message) {

        if (cooldowns.has(message.author.id)) {
            return message.react('⏳'); 
        }

        cooldowns.set(message.author.id, Date.now() + COOLDOWN_TIME);
        setTimeout(() => cooldowns.delete(message.author.id), COOLDOWN_TIME);

        const guild = message.guild;
        const serverBanner = guild.bannerURL({ size: 1024 });

        if (serverBanner) {
            const bannerEmbed = new EmbedBuilder()
                .setColor('#00f5ff') 
                .setAuthor({ name: `${guild.name}'s Server Banner`, iconURL: guild.iconURL({ dynamic: true }) })
                .setURL(serverBanner) 
                .setImage(serverBanner) 
                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTimestamp();

            const downloadButton = new ButtonBuilder()
                .setLabel('Download Banner')
                .setStyle(ButtonStyle.Link) 
                .setURL(serverBanner); 

            const row = new ActionRowBuilder().addComponents(downloadButton);

            await message.reply({ embeds: [bannerEmbed], components: [row] });
        } else {
            const noBannerEmbed = new EmbedBuilder()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }), })
                .setColor('Yellow')
                .setDescription('<:warning_26a0fe0f:1335402182177984654> This server does not have a banner set.');

            await message.reply({ embeds: [noBannerEmbed] });
        }
    }
};
