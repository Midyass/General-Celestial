const { EmbedBuilder, PermissionsBitField } = require("discord.js");

const COOLDOWN_TIME = 5000;
const cooldowns = new Map();

module.exports = {
    name: "unlock",
    description: "Unlock the channel so members can send messages.",
    async execute(message, args) {

        if (cooldowns.has(message.author.id)) return message.react('⏳');
        cooldowns.set(message.author.id, Date.now() + COOLDOWN_TIME);
        setTimeout(() => cooldowns.delete(message.author.id), COOLDOWN_TIME);

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor("Yellow")
                    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                    .setDescription('<:warning_26a0fe0f:1335402182177984654> You do not have permission to use this command.')
                ]
            });
        }

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor("Yellow")
                    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                    .setDescription('<:warning_26a0fe0f:1335402182177984654> I do not have permission to manage channels.')
                ]
            });
        }

        const channel = message.mentions.channels.first() || message.channel;

        try {
            const perms = channel.permissionOverwrites.cache.get(message.guild.roles.everyone.id);
            if (!perms || !perms.deny.has(PermissionsBitField.Flags.SendMessages)) {
                return message.reply({
                    embeds: [new EmbedBuilder()
                        .setColor("Yellow")
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setDescription("<:warning_26a0fe0f:1335402182177984654> This channel is already unlocked.")
                    ]
                });
            }

            await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SendMessages: true
            });

            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                    .setDescription(`<:true:1348715550477652080> Successfully unlocked ${channel}.`)
                ]
            });

        } catch (err) {
            console.error("Error unlocking channel:", err);
            return message.reply({
                embeds: [new EmbedBuilder()
                    .setColor("Yellow")
                    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                    .setDescription("<:warning_26a0fe0f:1335402182177984654> An error occurred while trying to unlock the channel.")
                ]
            });
        }
    }
};
