const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "temprole",
  aliases: ["addtemprole"],
  description: "Give a user a role temporarily.",
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Yellow")
            .setAuthor({ name: "Command: TempRole", iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription("<:warning_26a0fe0f:1335402182177984654> You don't have permission to use this command.")
        ]
      });
    }

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Yellow")
            .setAuthor({ name: "Command: TempRole", iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setDescription("<:warning_26a0fe0f:1335402182177984654> I don't have permission to manage roles.")
        ]
      });
    }

    // Get the user ID or tag
    let target = message.mentions.members.first();
    if (!target) {
      const userId = args[0]?.replace(/[<@!>]/g, ''); // Remove mention formatting
      if (userId && message.guild.members.cache.has(userId)) {
        target = message.guild.members.cache.get(userId); // Get member by ID
      } else {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Yellow")
              .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
              .setDescription("<:warning_26a0fe0f:1335402182177984654> Please mention a valid user or provide a valid user ID.")
          ]
        });
      }
    }

    // Get the role ID or tag
    let role = message.mentions.roles.first();
    if (!role) {
      const roleId = args[1]?.replace(/[<@&>]/g, ''); // Remove role mention formatting
      if (roleId && message.guild.roles.cache.has(roleId)) {
        role = message.guild.roles.cache.get(roleId); // Get role by ID
      } else {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Yellow")
              .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
              .setDescription("<:warning_26a0fe0f:1335402182177984654> Please mention a valid role or provide a valid role ID.")
          ]
        });
      }
    }

    if (role.position >= message.guild.members.me.roles.highest.position) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Yellow")
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setDescription(`<:warning_26a0fe0f:1335402182177984654> I cannot assign the role <@&${role.id}> because it's higher than my highest role.`)
        ]
      });
    }

    // Handle time argument (duration of the role)
    const timeArg = args[2]?.toLowerCase();
    let duration = 0;

    const regex = /^(\d+)([smhd])$/;
    const match = timeArg?.match(regex);

    if (!match) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#00f5ff")
            .setAuthor({ name: "Command: TempRole", iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .addFields(
              { name: "Usage:", value: "- &temprole `userID` `roleID` `time` or `@user` `@role` `time`", inline: false },
              { name: "Example:", value: `- &temprole 1273710101303263296 1358340546870907034 30m`, inline: false }
            )
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        ]
      });
    }

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's': duration = value * 1000; break;
      case 'm': duration = value * 60 * 1000; break;
      case 'h': duration = value * 60 * 60 * 1000; break;
      case 'd': duration = value * 24 * 60 * 60 * 1000; break;
    }

    try {
      await target.roles.add(role);

      message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setDescription(`<:yes:1357389908209307821> Successfully added <@&${role.id}> to <@${target.id}> for **${timeArg}**.`)
        ]
      });

      setTimeout(async () => {
        if (target.roles.cache.has(role.id)) {
          await target.roles.remove(role).catch(() => {});
          try {
            await target.send({
              embeds: [
                new EmbedBuilder()
                  .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
                  .setColor("Green")
                  .setDescription(`⏰ The role **${role.name}** was removed from you in **__${message.guild.name}__**.`)
              ]
            });
          } catch (e) {}
        }
      }, duration);

    } catch (err) {
      console.error(err);
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Yellow")
            .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setDescription("<:warning_26a0fe0f:1335402182177984654> Something went wrong while adding the role.")
        ]
      });
    }
  }
};
