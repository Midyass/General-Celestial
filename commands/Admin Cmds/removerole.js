const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "removerole",
  aliases: ["delrole", "roleremove"],
  description: "Remove a role from a user.",
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Yellow")
            .setAuthor({ name: "Command: RemoveRole", iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription("<:warning_26a0fe0f:1335402182177984654> You don't have permission to use this command.")
        ]
      });
    }

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Yellow")
            .setAuthor({ name: "Command: RemoveRole", iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription("<:warning_26a0fe0f:1335402182177984654> I don't have permission to manage roles.")
        ]
      });
    }


    let target = message.mentions.members.first();
    if (!target) {
      const userId = args[0]?.replace(/[<@!>]/g, '');
      target = await message.guild.members.fetch(userId).catch(() => null);
    }


    let role = message.mentions.roles.first();
    if (!role) {
      const roleId = args[1]?.replace(/[<@&>]/g, '');
      role = message.guild.roles.cache.get(roleId);
    }

    if (!target || !role) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#00f5ff")
            .setAuthor({ name: "Command: RemoveRole", iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .addFields(
              { name: "Usage:", value: "- &removerole `userId` `roleId`", inline: false },
              { name: "Example:", value: `- &removerole <@${message.author.id}> \`roleId\`\n- &removerole \`${message.author.id}\` \`roleId\``, inline: false }
            )
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        ]
      });
    }

    if (!message.guild.roles.cache.has(role.id)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Yellow")
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setDescription(`<:warning_26a0fe0f:1335402182177984654> The role <@&${role.id}> does not exist on this server.`)
        ]
      });
    }

    if (!target.roles.cache.has(role.id)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Yellow")
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setDescription(`<:warning_26a0fe0f:1335402182177984654> The user <@${target.id}> does not have the role <@&${role.id}>.`)
        ]
      });
    }

    if (role.position >= message.guild.members.me.roles.highest.position) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Yellow")
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setDescription(`<:warning_26a0fe0f:1335402182177984654> I cannot remove the role <@&${role.id}> because it's higher than my highest role.`)
        ]
      });
    }

    try {
      await target.roles.remove(role);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setDescription(`<:yes:1357389908209307821> Successfully removed <@&${role.id}> from <@${target.id}>.`)
        ]
      });
    } catch (err) {
      console.error(err);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Yellow")
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setDescription("<:warning_26a0fe0f:1335402182177984654> Something went wrong while removing the role.")
        ]
      });
    }
  }
};
