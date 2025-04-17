const { EmbedBuilder, PermissionsBitField } = require("discord.js");

const COOLDOWN = 5000;
const cooldowns = new Map();

module.exports = {
    name: "unban",
    description: "Unban a user from the server.",
    async execute(message, args) {
        if (cooldowns.has(message.author.id)) {
            return message.react("⏳");
        }

        cooldowns.set(message.author.id, Date.now() + COOLDOWN);
        setTimeout(() => cooldowns.delete(message.author.id), COOLDOWN);

        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setColor("Yellow")
                        .setDescription('<:warning_26a0fe0f:1335402182177984654> You do not have permission to use this command.')
                ]
            });
        }

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setColor("Yellow")
                        .setDescription('<:warning_26a0fe0f:1335402182177984654> I do not have permission to use this command.')
                ]
            });
        }

        let userId = args[0]?.replace(/[<>@!]/g, ''); 

        if (!userId) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#00f5ff")
                        .setAuthor({ name: "Command: Unban", iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .addFields(
                            { name: "Usage:", value: "- &unban `userId` or `@user`", inline: false },
                            { name: "Example:", value: `- &unban <@${message.author.id}>\n- &unban \`123456789012345678\``, inline: false }
                        )
                        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                ]
            });
        }

        try {

            const bannedUser = await message.guild.bans.fetch(userId).catch(() => null);
            if (!bannedUser) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Yellow")
                            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                            .setDescription('<:warning_26a0fe0f:1335402182177984654> This user has never been banned from the server.')
                    ]
                });
            }


            await message.guild.members.unban(userId, 'Unbanned by admin.');

            const successEmbed = new EmbedBuilder()
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                .setColor("Green")
                .setDescription(`<:yes:1357389908209307821> Successfully unbanned <@${userId}> from the server.`);

            return message.reply({ embeds: [successEmbed] });

        } catch (error) {
            console.error("Error unbanning user:", error);

            const failEmbed = new EmbedBuilder()
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                .setColor("Yellow")
                .setDescription('<:warning_26a0fe0f:1335402182177984654> An error occurred while trying to unban the user.');

            return message.reply({ embeds: [failEmbed] });
        }
    }
};
