const { EmbedBuilder } = require('discord.js');

const cooldowns = new Map();
const COOLDOWN_TIME = 5000; 

module.exports = {
  name: "anti-webhook",
  aliases: ["antiwebhook", "webhook", "antiwebhooks"],
  description: "Enable or disable the Anti-Webhook feature.",

  async execute(message, args, client) {
    const devs = ["1256648284316110880", "1288459425979564032", "1218034475775299688"];

    if (cooldowns.has(message.author.id)) {
      return message.react('⏳');
    }
    cooldowns.set(message.author.id, Date.now() + COOLDOWN_TIME);
    setTimeout(() => cooldowns.delete(message.author.id), COOLDOWN_TIME);

    if (!devs.includes(message.author.id) && message.author.id !== message.guild.ownerId) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }), })
          .setDescription("<:warning_26a0fe0f:1335402182177984654> You don't have permission to use this command.").setColor("Yellow")]
      });
    }

    const option = args[0]?.toLowerCase();
    if (!["on", "off", "status"].includes(option)) {
      const embed = new EmbedBuilder()
        .setColor("#00b7ff")
        .setAuthor({ name: 'Command : AntiWebhook', iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .addFields(
          { name: "__Aliases__ :", value: "- `antiwebhook`, `webhook`", inline: false },
          { name: "__Usage__ :", value: "- &antiwebhook `on` `off` `status`", inline: false },
          { name: "__Examples__ :", value: "- &antiwebhook `on`\n- &antiwebhook `off`\n- &antiwebhook `status`", inline: false }
        )
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
      return message.reply({ embeds: [embed] });
    }

    const settings = await client.getSettings(message.guild.id);
    if (!settings) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }), })
          .setDescription("<:warning_26a0fe0f:1335402182177984654> There was an issue fetching the settings. Please try again later.").setColor("Red")]
      });
    }

    const antiWebhookEnabled = settings.antiWebhook === 1;

    if (option === "status") {
      const statusEmbed = new EmbedBuilder()
        .setColor(antiWebhookEnabled ? "#00b7ff" : "#00b7ff")
        .setAuthor({ name: 'Anti Webhook : Status', iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .addFields(
          { name: "__Anti Webhook Status__ :", value: antiWebhookEnabled ? "Enabled <:On:1349698525360947241>" : "Disabled <:Off:1349698291259932735>", inline: false }
        )
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));      
      return message.reply({ embeds: [statusEmbed] });
    }

    if (option === "on" || option === "off") {
      const isEnabled = option === "on" ? 1 : 0;
      await client.saveSettings(message.guild.id, "antiWebhook", isEnabled);

      const embed = new EmbedBuilder()
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }), }) 
        .setDescription(`${isEnabled ? " <:On:1349698525360947241> Anti Webhook is now **Enabled**." : " <:Off:1349698291259932735> Anti Webhook is now **Disabled**."}`)
        .setColor(isEnabled ? "Green" : "Yellow");

      return message.reply({ embeds: [embed] });
    }
  },

  async onMessage(message, client) {
    if (message.author.bot || !message.guild) return;

    const settings = await client.getSettings(message.guild.id);
    if (!settings || settings.antiWebhook === 0) return;

    if (message.webhookId) {
      try {
        await message.delete(); 
      } catch (error) {
        console.error('Error deleting webhook message:', error); 
      }
    }
  }
};
