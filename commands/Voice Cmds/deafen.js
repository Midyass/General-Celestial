const { EmbedBuilder, PermissionsBitField } = require("discord.js");

const COOLDOWN_TIME = 5000;
const cooldowns = new Map();

module.exports = {
    name: "deafen",
    description: "Deafen a user in the voice channel.",
    async execute(message, args) {

        if (cooldowns.has(message.author.id)) {
            return message.react('⏳');
        }

        cooldowns.set(message.author.id, Date.now() + COOLDOWN_TIME);
        setTimeout(() => cooldowns.delete(message.author.id), COOLDOWN_TIME);

        if (!message.member.permissions.has(PermissionsBitField.Flags.DeafenMembers)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setDescription('<:warning_26a0fe0f:1335402182177984654> You do not have permission to use this command.')
                ]
            });
        }

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.DeafenMembers)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
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
                        .setColor("Random")
                        .setAuthor({ name: "Command: deafen", iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .addFields(
                            { name: "__Usage__ :", value: "- &deafen `userId`", inline: false },
                            { name: "__Example__ :", value: `- &deafen <@${message.author.id}>\n- &deafen \`${message.author.id}\``, inline: false }
                        )
                        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
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

        if (target.voice.serverDeaf) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Yellow")
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setDescription(`<:warning_26a0fe0f:1335402182177984654> <@${target.id}> is already deafened.`)
                ]
            });
        }

        try {
            await target.voice.setDeaf(true);

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                .setDescription(`<:yes:1357389908209307821> Successfully deafened <@${target.id}> in the voice channel.`);

            return message.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error deafening user:", error);

            const errorEmbed = new EmbedBuilder()
                .setColor("Yellow")
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                .setDescription("<:warning_26a0fe0f:1335402182177984654> An error occurred while trying to deafen the user.");

            return message.reply({ embeds: [errorEmbed] });
        }
    }
};
