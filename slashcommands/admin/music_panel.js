const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');
const MusicPanel = require("../models/guildConfig");


module.exports = {
  data: new SlashCommandBuilder()
    .setName('music_panel')
    .setDescription('Setup music panel for selected bots in a specific channel.')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to send the music panel in.')
        .setRequired(true))
    .addStringOption(option => option.setName('bot1').setDescription('Bot 1 ID').setRequired(true))
    .addStringOption(option => option.setName('bot2').setDescription('Bot 2 ID').setRequired(true))
    .addStringOption(option => option.setName('bot3').setDescription('Bot 3 ID'))
    .addStringOption(option => option.setName('bot4').setDescription('Bot 4 ID'))
    .addStringOption(option => option.setName('bot5').setDescription('Bot 5 ID'))
    .addStringOption(option => option.setName('bot6').setDescription('Bot 6 ID'))
    .addStringOption(option => option.setName('bot7').setDescription('Bot 7 ID'))
    .addStringOption(option => option.setName('bot8').setDescription('Bot 8 ID')),

  async execute(interaction) {
    try {
      if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        const noPermsEmbed = new EmbedBuilder()
          .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
          .setColor('Yellow')
          .setDescription('<:warning_26a0fe0f:1335402182177984654> You don\'t have permission to use this command.');
        return await interaction.reply({ embeds: [noPermsEmbed], ephemeral: true });
      }

      await interaction.deferReply({ ephemeral: true });

      const guild = interaction.guild;
      const channel = interaction.options.getChannel('channel');
      const botIds = [
        interaction.options.getString('bot1'),
        interaction.options.getString('bot2'),
        interaction.options.getString('bot3'),
        interaction.options.getString('bot4'),
        interaction.options.getString('bot5'),
        interaction.options.getString('bot6'),
        interaction.options.getString('bot7'),
        interaction.options.getString('bot8')
      ].filter(Boolean);

      const buildEmbed = async () => {
        const inVoice = [];
        const notInVoice = [];

        for (const botId of botIds) {
          try {
            const botMember = await guild.members.fetch(botId);
            const tag = `<@${botId}>`;

            if (botMember.voice.channel) {
              inVoice.push(tag);
            } else {
              notInVoice.push(tag);
            }
          } catch (err) {
            console.error(`Error fetching bot ${botId}:`, err);
          }
        }

        const embed = new EmbedBuilder()
          .setColor('Random')
          .setAuthor({ name: `${guild.name} 🎶 Music Panel`, iconURL: guild.iconURL() || 'https://i.imgur.com/ax8Q3MG.png' })
          .setThumbnail(guild.iconURL({ dynamic: true }))
          .setImage('https://cdn.discordapp.com/attachments/1357396690440556644/1359426713804603503/Time_to_Relax_with_Anime_Music_1.gif?ex=67f77049&is=67f61ec9&hm=6d5dc5b0d47cb63057626c67cec7f0d8928332e2630e4ddd597aaf902ac39dec&')
          .setTimestamp()
          .setFooter({ text: `Music Bots Status | ${guild.name} 🎶`, iconURL: guild.iconURL() || 'https://i.imgur.com/ax8Q3MG.png' });

        if (notInVoice.length > 0) {
          embed.addFields({
            name: '<a:online:1336740782924632084> **__Available Bots__  :**',
            value: notInVoice.join('\n'),
            inline: true
          });
        }

        if (inVoice.length > 0) {
          embed.addFields({
            name: '<a:offline:1336740809416114289> **__Busy Bots__ :**',
            value: inVoice.join('\n'),
            inline: true
          });
        }

        return embed;
      };

      const panelData = await MusicPanel.findOne({ guildId: guild.id });
      const embed = await buildEmbed();

      const statsButton = new ButtonBuilder()
        .setCustomId('server_stats_button')
        .setDisabled(true)
        .setLabel(`🎶 Music Bots Status`)
        .setStyle(ButtonStyle.Secondary);

      const row = new ActionRowBuilder().addComponents(statsButton);

      let sentMessage;

      if (panelData) {
        try {
          const oldChannel = guild.channels.cache.get(panelData.channelId);
          const oldMessage = await oldChannel.messages.fetch(panelData.messageId);
          await oldMessage.edit({ embeds: [embed], components: [row] });
          sentMessage = oldMessage;
        } catch (err) {
          sentMessage = await channel.send({ embeds: [embed], components: [row] });
        }
      } else {
        sentMessage = await channel.send({ embeds: [embed], components: [row] });
      }

      await MusicPanel.findOneAndUpdate(
        { guildId: guild.id },
        {
          guildId: guild.id,
          channelId: channel.id,
          botIds: botIds,
          messageId: sentMessage.id
        },
        { upsert: true }
      );

      const successEmbed = new EmbedBuilder()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setColor('Green')
        .setDescription(`<:yes:1357389908209307821> Music panel is active in ${channel}.`);

      await interaction.editReply({ embeds: [successEmbed], ephemeral: true });

      setInterval(async () => {
        try {
          const updatedPanel = await MusicPanel.findOne({ guildId: guild.id });
          if (!updatedPanel) return;

          const updateChannel = guild.channels.cache.get(updatedPanel.channelId);
          if (!updateChannel) return;

          const updateMessage = await updateChannel.messages.fetch(updatedPanel.messageId);
          const newEmbed = await buildEmbed();
          await updateMessage.edit({ embeds: [newEmbed], components: [row] });
        } catch (err) {
          console.error('Error updating music panel:', err);
        }
      }, 5000);

    } catch (err) {
      console.error('Setup failed:', err);

      const errorEmbed = new EmbedBuilder()
         .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setColor('Yellow')
        .setDescription('<:warning_26a0fe0f:1335402182177984654> There was an error setting up the music panel. Please try again later.');

      await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
