const { EmbedBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const COOLDOWN_TIME = 5000;
const cooldowns = new Map();

module.exports = {
    name: 'statsvoice',
    description: 'Displays the server status',
    aliases: ['vc'],
    async execute(message, args) {

        if (cooldowns.has(message.author.id)) {
            return message.react('⏳');
        }

        cooldowns.set(message.author.id, Date.now() + COOLDOWN_TIME);
        setTimeout(() => cooldowns.delete(message.author.id), COOLDOWN_TIME);

        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
            await message.delete();
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setDescription('<:warning_26a0fe0f:1335402182177984654> You do not have permission to use this command.')
                ]
            });
        }

        await message.delete();

        const guild = message.guild;
        const members = guild.members.cache;
        const totalMembers = members.size;
        const membersInVoice = members.filter(member => member.voice.channelId).size;
        const onlineMembers = members.filter(member => member.presence && member.presence.status !== 'offline').size;
        const boostCount = guild.premiumSubscriptionCount || 0;
        const streamers = members.filter(member => member.presence?.activities.some(a => a.type === 1)).size;
        const boosters = members.filter(member => member.roles.cache.some(r => r.name.includes('Booster'))).size;
        const guildIconURL = guild.iconURL();

        const embedMessage = new EmbedBuilder()
            .setAuthor({ name: `${guild.name} Stats`, iconURL: guildIconURL })
            .setColor('Random')
            .setThumbnail(guildIconURL || undefined)
            .addFields({
                name: '',
                value: `> \`👤\` Members: **${totalMembers}**\n> \`🔊\` In Voice: **${membersInVoice}**\n> \`☄️\` Online: **${onlineMembers}**\n> \`💥\` Boosts: **${boostCount}**`,
                inline: false
            })
            .setFooter({ text: `${guild.name} stats.`, iconURL: guildIconURL })
            .setTimestamp();

        const statsButton = new ButtonBuilder()
            .setCustomId('stats')
            .setLabel(`Stats : ${guild.name}`)
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(statsButton);

        await message.channel.send({ embeds: [embedMessage], components: [row] });
    }
};
