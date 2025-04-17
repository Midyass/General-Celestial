const { EmbedBuilder } = require('discord.js');

const COOLDOWN = 5000;
const cooldowns = new Map();

module.exports = {
    name: 'vclist',
    aliases: ['vL'],
    description: 'Shows a list of users currently in your voice channel.',
    async execute(message) {
        if (cooldowns.has(message.author.id)) {
            return message.react("⏳");
        }

        cooldowns.set(message.author.id, Date.now() + COOLDOWN);
        setTimeout(() => cooldowns.delete(message.author.id), COOLDOWN);

        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Yellow')
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setDescription('<:warning_26a0fe0f:1335402182177984654> You must be in a voice channel to use this command.')
                ]
            });
        }

        const members = voiceChannel.members;
        const memberMentions = members.map(member => `- <@${member.user.id}>`).join('\n');

        const embed = new EmbedBuilder()
            .setColor('#00f5ff')
            .setAuthor({ name: `Users in VC`, iconURL: message.guild.iconURL() })
            .setDescription(`__Current members in__ \`${voiceChannel.name}\`:\n${memberMentions || '*No one is in the VC!*'}`)
            .setThumbnail(message.guild.iconURL())
            .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
