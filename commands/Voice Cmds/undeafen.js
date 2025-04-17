const { EmbedBuilder, PermissionsBitField } = require("discord.js");

const COOLDOWN_TIME = 5000;
const cooldowns = new Map();

module.exports = {
    name: "undeafen",
    description: "Un-deafen a user in the voice channel.",
    async execute(message, args) {
        if (cooldowns.has(message.author.id)) {
            return message.react("⏳");
        }

        cooldowns.set(message.author.id, Date.now() + COOLDOWN_TIME);
        setTimeout(() => cooldowns.delete(message.author.id), COOLDOWN_TIME);

        if (!message.member.permissions.has(PermissionsBitField.Flags.DeafenMembers)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setDescription("<:warning_26a0fe0f:1335402182177984654> You do not have permission to use this command.")
                ]
            });
        }

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.DeafenMembers)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setDescription("<:warning_26a0fe0f:1335402182177984654> I do not have permission to deafen members.")
                ]
            });
        }

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!user) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#00f5ff")
                        .setAuthor({ name: "Command: undeafen", iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .addFields(
                            { name: "__Usage__ :", value: "- &undeafen `userId`", inline: false },
                            { name: "__Example__ :", value: `- &undeafen <@${message.author.id}>\n- &undeafen \`${message.author.id}\``, inline: false }
                        )
                        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                ]
            });
        }

        if (!message.guild.members.cache.has(user.id)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setDescription("<:warning_26a0fe0f:1335402182177984654> There is no such user in this server.")
                ]
            });
        }

        if (!user.voice.channel) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setDescription(`<:warning_26a0fe0f:1335402182177984654> <@${user.id}> is not connected to a voice channel.`)
                ]
            });
        }

        if (!user.voice.serverDeaf) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setDescription(`<:warning_26a0fe0f:1335402182177984654> <@${user.id}> is not currently deafened.`)
                ]
            });
        }

        try {
            await user.voice.setDeaf(false);

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                .setDescription(`<:true:1348715550477652080> Successfully undeafened <@${user.id}>.`);

            return message.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error un-deafening user:", error);

            const errorEmbed = new EmbedBuilder()
                .setColor("#00f5ff")
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                .setDescription("<:warning_26a0fe0f:1335402182177984654> Failed to undeafen. Missing permissions or user not in channel.");

            return message.reply({ embeds: [errorEmbed] });
        }
    }
};
