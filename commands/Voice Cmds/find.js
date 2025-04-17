const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'find',
    description: 'Finds a user in a voice channel and displays relevant information.',
    async execute(message, args) {
        let user;
        let inputSelf = false;

        if (message.mentions.users.size > 0) {
            user = message.mentions.users.first();
            if (user.id === message.author.id) inputSelf = true;
        } else if (args.length > 0) {
            user = await message.client.users.fetch(args[0]).catch(() => null);
            if (user && user.id === message.author.id) inputSelf = true;
        } else {

            const usageEmbed = new EmbedBuilder()
                .setColor("#00b7ff")
                .setAuthor({ name: 'Command : Find', iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .addFields(
                    { name: "__Usage__ :", value: "- &find `userId`", inline: false },
                    { name: "__Example__ :", value: `- &find <@${message.author.id}>\n- &find \`${message.author.id}\``, inline: false }
                )
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
            return message.channel.send({ embeds: [usageEmbed] });
        }

        if (!user) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                        .setDescription("<:warning_26a0fe0f:1335402182177984654> User not found.")
                        .setColor("Yellow")
                ]
            });
        }

        if (inputSelf) {
            const selfFindEmbed = new EmbedBuilder()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setDescription("<:warning_26a0fe0f:1335402182177984654> You can't find yourself!")
                .setColor('Yellow');
            return message.channel.send({ embeds: [selfFindEmbed] });
        }


        const member = await message.guild.members.fetch(user.id).catch(() => null);
        const embed = new EmbedBuilder().setColor('#00b7ff');

        if (!member) {
            embed
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setDescription(`<:warning_26a0fe0f:1335402182177984654> Could not find that user in the server.`)
                .setColor('Red');
        } else if (member.voice.channel) {
            const voiceChannel = member.voice.channel;

            embed
                .addFields(
                    { name: '<:fum:1335402284682711102> **Voice Check:**', value: `<#${voiceChannel.id}>`, inline: true },
                    { name: '<:fum:1335402284682711102> **Voice Name:**', value: `\`${voiceChannel.name}\``, inline: true },
                )
                .setAuthor({ name: `Voice Find: ${voiceChannel.name}`, iconURL: message.guild.iconURL(), url: "https://discord.gg/D32kergpFw" })
                .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 64 }))
                .setFooter({ text: `${user.tag}`, iconURL: user.displayAvatarURL({ dynamic: true, size: 32 }) })
                .setTimestamp();
        } else {
            embed
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setDescription(`<:warning_26a0fe0f:1335402182177984654> <@${user.id}> is not connected to any voice channel.`)
                .setColor('Yellow');
        }

        await message.channel.send({ embeds: [embed] });
    },
};
