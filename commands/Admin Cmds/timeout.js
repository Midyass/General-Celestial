const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    name: "timeout",
    aliases: ["tempmute", "muteuser"],
    description: "Timeout a user from the server.",
    async execute(message, args) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setColor("Yellow")
                        .setDescription('<:warning_26a0fe0f:1335402182177984654> You do not have permission to use this command.')
                ]
            });
        }

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setColor("Yellow")
                        .setDescription('<:warning_26a0fe0f:1335402182177984654> I do not have permission to use this command.')
                ]
            });
        }

        let target = message.mentions.members.first();
        if (!target) {
            const userId = args[0]?.replace(/[<>@!]/g, ''); 
            if (!userId) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                            .setColor("Yellow")
                            .setDescription("<:warning_26a0fe0f:1335402182177984654> Please mention a valid user or provide a valid user ID.")
                    ]
                });
            }

            target = message.guild.members.cache.get(userId);
            if (!target) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                            .setColor("Yellow")
                            .setDescription(`<:warning_26a0fe0f:1335402182177984654> User with ID <@${userId}> is not in the server.`)
                    ]
                });
            }
        }

        let timeoutDuration = 0;
        const timeArg = args[1]?.toLowerCase();


        if (timeArg) {
            const regex = /^(\d+)([smhd])$/;
            const match = timeArg.match(regex);
            if (match) {
                const value = parseInt(match[1]);
                const unit = match[2];

                switch (unit) {
                    case 's': timeoutDuration = value * 1000; break; 
                    case 'm': timeoutDuration = value * 60 * 1000; break;
                    case 'h': timeoutDuration = value * 60 * 60 * 1000; break; 
                    case 'd': timeoutDuration = value * 24 * 60 * 60 * 1000; break; 
                    default: return message.reply("Invalid time unit.");
                }
            } else {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Yellow")
                            .setDescription("<:warning_26a0fe0f:1335402182177984654> Please provide a valid time format (1s, 10m, 1h, 1d).")
                    ]
                });
            }
        }

        if (timeoutDuration === 0) {
            timeoutDuration = 5 * 60 * 1000; 
        }

        try {
            await target.timeout(timeoutDuration, 'Timeout by command.');

            try {
                await target.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#00f5ff")
                            .setAuthor({ name: `Timed out in ${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true }) })
                            .setDescription(`You were timed out in **__${message.guild.name}__**\n**__Time__ :** ${args.slice(1).join(" ") || "`None`"}`)
                            .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    ]
                });
            } catch (error) {
                if (error.code === 50007) {
                    return message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                                .setColor("Yellow")
                                .setDescription(`<:warning_26a0fe0f:1335402182177984654> Could not send DM to <@${target.id}>. Their DMs are disabled.`)
                        ]
                    });
                }
                console.error("Error sending DM:", error);
            }

            message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setColor("Green")
                        .setDescription(`<:yes:1357389908209307821> Successfully timed out <@${target.id}> for ${args[1] || '5 minutes'}.`)
                ]
            });

        } catch (error) {
            console.error("Error applying timeout:", error);
            message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                        .setColor("Yellow")
                        .setDescription("<:warning_26a0fe0f:1335402182177984654> An error occurred while applying the timeout.")
                ]
            });
        }
    }
};
