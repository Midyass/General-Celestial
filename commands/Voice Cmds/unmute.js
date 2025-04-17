const { EmbedBuilder, PermissionsBitField } = require("discord.js");

const COOLDOWN_TIME = 5000;
const cooldowns = new Map();

module.exports = {
    name: "unmute",
    aliases: ["vunmute", "voiceunmute"],
    description: "Unmute a user in the voice channel.",
    async execute(message, args) {
        if (cooldowns.has(message.author.id)) {
            return message.react("⏳");
        }

        cooldowns.set(message.author.id, Date.now() + COOLDOWN_TIME);
        setTimeout(() => cooldowns.delete(message.author.id), COOLDOWN_TIME);

        if (!message.member.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setDescription("<:warning_26a0fe0f:1335402182177984654> You do not have permission to use this command.")
                ]
            });
        }

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setDescription("<:warning_26a0fe0f:1335402182177984654> I do not have permission to unmute members.")
                ]
            });
        }

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!target) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#00f5ff")
                        .setAuthor({ name: "Command: unmute", iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .addFields(
                            { name: "__Usage__ :", value: "- &unmute `userId`", inline: false },
                            { name: "__Example__ :", value: `- &unmute <@${message.author.id}>\n- &unmute \`${message.author.id}\``, inline: false }
                        )
                        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                ]
            });
        }

        if (!message.guild.members.cache.has(target.id)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setDescription("<:warning_26a0fe0f:1335402182177984654> There is no such user in this server.")
                ]
            });
        }

        if (!target.voice.channel) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setDescription(`<:warning_26a0fe0f:1335402182177984654> <@${target.id}> is not connected to a voice channel.`)
                ]
            });
        }

        if (!target.voice.serverMute) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setDescription(`<:warning_26a0fe0f:1335402182177984654> <@${target.id}> is not muted.`)
                ]
            });
        }

        try {
            await target.voice.setMute(false);

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                .setDescription(`<:yes:1357389908209307821> Successfully unmuted <@${target.id}> in the voice channel.`);

            return message.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error unmuting user:", error);

            const errorEmbed = new EmbedBuilder()
                .setColor("#00f5ff")
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                .setDescription("<:warning_26a0fe0f:1335402182177984654> Failed to unmute. Check bot permissions or voice channel access.");

            return message.reply({ embeds: [errorEmbed] });
        }
    }
};
