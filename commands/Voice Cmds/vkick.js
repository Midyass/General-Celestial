const { EmbedBuilder, PermissionsBitField } = require("discord.js");

const COOLDOWN = 5000;
const cooldowns = new Map();

module.exports = {
    name: "vkick",
    aliases: ["voicekick", "vcreject"],
    description: "Kick a user from the voice channel.",
    async execute(message, args) {
        if (cooldowns.has(message.author.id)) {
            return message.react("⏳");
        }

        cooldowns.set(message.author.id, Date.now() + COOLDOWN);
        setTimeout(() => cooldowns.delete(message.author.id), COOLDOWN);

        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setColor("Yellow")
                        .setDescription('<:warning_26a0fe0f:1335402182177984654> You do not have permission to use this command.')
                ]
            });
        }

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setColor("Yellow")
                        .setDescription('<:warning_26a0fe0f:1335402182177984654> I do not have permission to use this command.')
                ]
            });
        }

        let target;
        if (message.mentions.members.size) {
            target = message.mentions.members.first();
        } else if (args[0]) {
            target = message.guild.members.cache.get(args[0]);
        }

        if (!target) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#00f5ff")
                        .setAuthor({ name: "Command: VoiceKick", iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .addFields(
                            { name: "Usage:", value: "- &vkick `@user` or `userID`", inline: false },
                            { name: "Example:", value: `- &vkick <@${message.author.id}>\n- &vkick \`${message.author.id}\``, inline: false }
                        )
                        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                ]
            });
        }

        if (!message.guild.members.cache.has(target.id)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setColor("Yellow")
                        .setDescription("<:warning_26a0fe0f:1335402182177984654> There is no such user in this server.")
                ]
            });
        }

        if (!target.voice.channel) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setColor("Yellow")
                        .setDescription(`<:warning_26a0fe0f:1335402182177984654> <@${target.id}> is not connected to a voice channel.`)
                ]
            });
        }

        if (target.roles.highest.position >= message.guild.members.me.roles.highest.position) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setColor("Yellow")
                        .setDescription("<:warning_26a0fe0f:1335402182177984654> I cannot kick this user as their role is higher or equal to mine.")
                ]
            });
        }

        try {
            await target.voice.disconnect();

            const successEmbed = new EmbedBuilder()
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                .setColor("Green")
                .setDescription(`<:yes:1357389908209307821> Successfully kicked <@${target.id}> from the voice channel.`);

            return message.reply({ embeds: [successEmbed] });

        } catch (error) {
            console.error("Error kicking user from voice channel:", error);

            const failEmbed = new EmbedBuilder()
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                .setColor("Yellow")
                .setDescription("<:warning_26a0fe0f:1335402182177984654> An error occurred while trying to kick the user from the voice channel.");

            return message.reply({ embeds: [failEmbed] });
        }
    }
};
