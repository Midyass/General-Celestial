const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "Shows all available commands.",
  cooldown: 5,
  async execute(message, args) {
    const supportServerLink = "https://discord.gg/kYJnSKFa3U";
    const botIcon = message.client.user.displayAvatarURL({ dynamic: true });

    const commandCategories = {
      "admin": [
        "> `&addrole`  Add a role to a user.",
        "> `&addemoji`  Add an emoji to the server.",
        "> `&ban`  Ban a user.",
        "> `&boosters`  Show server boosters.",
        "> `&channelinfo`  Show channel information.",
        "> `&clear`  Clear messages.",
        "> `&crole`  Create a role.",
        "> `&embed`  Create an embed message.",
        "> `&emojiinfo`  Show emoji information.",
        "> `&firstmessage`  Show the first message in a channel.",
        "> `&hide`  Hide a channel.",
        "> `&inrole`  Show users in a role.",
        "> `&inviteinfo`  Show invite information.",
        "> `&jail`  Jail a user.",
        "> `&kick`  Kick a user.",
        "> `&lock`  Lock a channel.",
        "> `&membercount`  Show member count.",
        "> `&move`  Move a user to another voice channel.",
        "> `&nick`  Change a user's nickname.",
        "> `&removerole`  Remove a role from a user.",
        "> `&roleinfo`  Show role information.",
        "> `&tax`  Calculate Discord tax.",
        "> `&temprole`  Temporarily assign a role.",
        "> `&timeout`  Timeout a user.",
        "> `&unban`  Unban a user.",
        "> `&unhide`  Unhide a channel.",
        "> `&unjail`  Unjail a user.",
        "> `&unlock`  Unlock a channel.",
        "> `&untimeout`  Remove timeout from a user."
      ],
      "fun": [
        "> `&cat`  Show a random cat picture.",
        "> `&cringe`  Display a cringe message.",
        "> `&dance`  Dance.",
        "> `&gendre`  Show the user's gender.",
        "> `&howgay`  Check how gay someone is.",
        "> `&love`  Calculate love percentage.",
        "> `&roll`  Roll a dice.",
        "> `&slape`  Slap a user.",
        "> `&smile`  Smile at someone."
      ],
      "info": [
        "> `&avatar`  Show user's avatar.",
        "> `&banner`  Show user's banner.",
        "> `&channelinfo`  Show channel info.",
        "> `&invite`  Get bot invite.",
        "> `&membercount`  Show server member count.",
        "> `&ping`  Show bot latency.",
        "> `&serverinfo`  Show server info.",
        "> `&user`  Show user info."
      ],
      "voicemod": [
        "> `&activity`  Enable or disable activities in voice.",
        "> `&cam`  Enable or disable camera in voice.",
        "> `&vdeafen`  Deafen a member in voice.",
        "> `&find`  Find a member in voice.",
        "> `&vclist`  Show list of members in voice.",
        "> `&vmute`  Mute a member in voice.",
        "> `&vunmute`  Unmute a member in voice."
      ],
      "verification": [
        "> `&vb`  Verify a member.",
        "> `&vg`  Verify a female member.\n",
        "> `/setupverif`  Setup verification."
      ],
      "jail": [
        "> `&jail <User>`  Jail a user.",
        "> `&unjail <User>`  Unjail a user.\n",
        "> `/setupjail`  Setup Jail System."
      ],
      "moderation": [
        "> `&ban`  Ban a user (even if they are not in the server).",
        "> `&derank`  Remove a member's rank.",
        "> `&kick`  Kick a user from the server.",
        "> `&mute`  Mute a user in the server.",
        "> `&nickname`  Change or reset a user's nickname.",
        "> `&role`  Add or remove a role from a user.",
        "> `&temprole`  Temporarily assign a role.",
        "> `&timeout`  Timeout a user.",
        "> `&unban`  Unban a user from the server.",
        "> `&unmute`  Unmute a user in the server.",
        "> `&untimeout`  Remove timeout from a user.",
        "> `&warn`  Warn a user, check warnings, or remove warnings."
      ],
      "security": [
        "> `&antibots`  Enable or disable AntiBot protection.",
        "> `&antilink`  Enable or disable AntiLink protection.",
        "> `&antilinkstats`  Show AntiLink statistics.",
        "> `&antilinkwhitelist`  Whitelist a role or user from AntiLink.",
        "> `&antilinkunwhitelist`  Remove a user or role from the whitelist.",
        "> `&antiwebhook`  Enable or disable AntiWebhook protection."
      ],
    };

    if (!args.length) {
      const helpEmbed = new EmbedBuilder()
        .setColor("#00e1ff")
        .setAuthor({ name: 'Celestial Help', iconURL: botIcon })
        .setDescription(
          "> `&help admin`  Shows adminrelated commands\n" +
          "> `&help fun`  Lists fun commands\n" +
          "> `&help info`  Shows informational commands\n" +
          "> `&help voicemod`  Provides voice modulation commands\n" +
          "> `&help verification`  Displays verification commands\n" +
          "> `&help jail`  Lists jail commands\n" +
          "> `&help moderation`  Shows moderation commands\n" +
          "> `&help security`  Shows security commands\n\n" +
          "> **__Join our support server for updates & support__**\n" +
          "> <:c_:1342488003817246804> **・Support** : " + supportServerLink
        );

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("・Discord Server")
          .setURL(supportServerLink)
          .setEmoji("<:c_:1342488003817246804>")
          .setStyle(ButtonStyle.Link),
      );

      return message.reply({ embeds: [helpEmbed], components: [row] });
    }

    const categoryName = args[0].toLowerCase();
    if (commandCategories[categoryName]) {
      const categoryCommands = commandCategories[categoryName];
      const categoryEmbed = new EmbedBuilder()
        .setColor("#00e1ff")
        .setAuthor({ name: `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Commands`, iconURL: botIcon })
        .setDescription(categoryCommands.join("\n"));

      return message.reply({ embeds: [categoryEmbed] });
    }

    return message.reply("❌ **Invalid category!** Use `&help` or `&help <category>`.");
  },
};
