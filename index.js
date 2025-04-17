const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const { token, mongoURI, prefix, clientId } = require('./utils/config');  

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildWebhooks
  ],
  partials: [Partials.User, Partials.Channel, Partials.Message]
});

module.exports = client;
client.prefixCommands = new Collection();
client.slashCommands = new Collection();
client.cooldowns = new Map();

const prefixFiles = fs.readdirSync('./commands').flatMap(folder =>
  fs.readdirSync(`./commands/${folder}`).filter(f => f.endsWith('.js')).map(file => `./commands/${folder}/${file}`)
);

for (const file of prefixFiles) {
  const command = require(file);
  client.prefixCommands.set(command.name, command);
  if (command.aliases) {
    for (const alias of command.aliases) {
      client.prefixCommands.set(alias, command);
    }
  }
}

const slashFiles = fs.readdirSync('./slashCommands').filter(f => f.endsWith('.js'));

for (const file of slashFiles) {
  const command = require(`./slashCommands/${file}`);
  client.slashCommands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(f => f.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  event.once
    ? client.once(event.name, (...args) => event.execute(...args, client))
    : client.on(event.name, (...args) => event.execute(...args, client));
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Database connected successfully!');
}).catch(err => {
  console.error('Error connecting to database:', err);
});


client.saveSettings = async (guildId, field, value) => {
  const model = require("./models/guildConfig");
  try {
    await model.findOneAndUpdate(
      { guildId },
      { [field]: value },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error('Error saving settings:', err);
  }
};


client.getSettings = async (guildId) => {
  const model = require("./models/guildConfig");
  try {
    const settings = await model.findOne({ guildId });
    return settings || {};
  } catch (err) {
    console.error('Error fetching settings:', err);
    return {};
  }
};

client.on('guildMemberAdd', async (member) => {
  const settings = await client.getSettings(member.guild.id);

  if (settings && settings.antiBot === 1 && member.user.bot) {
    await member.kick('Anti-bot system enabled.');
  }

  const roleId = settings?.autoRole;
  if (roleId) {
    const role = member.guild.roles.cache.get(roleId);
    if (role) {
      await member.roles.add(role).catch(() => {});
    }
  }
});


client.on('webhookCreate', async (webhook) => {
  const settings = await client.getSettings(webhook.guild.id);
  if (settings && settings.antiWebhook === 1) {
    if (webhook.guild.members.me.permissions.has("ManageWebhooks")) {
      await webhook.delete('Anti-Webhook system enabled.');
    }
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;

  const settings = await client.getSettings(message.guild.id);
  if (!settings || settings.antiLink === 0) return;

  const whitelistedRoles = settings.whitelistedRoles || [];
  const userRoles = message.member.roles.cache.map(role => role.id);
  const isWhitelisted = userRoles.some(roleId => whitelistedRoles.includes(roleId));

  if (isWhitelisted) return;

  const linkRegex = /(https?:\/\/[^\s]+)/gi;
  if (linkRegex.test(message.content)) {
    try {
      await message.delete();
      console.log(`Deleted a link from: ${message.author.tag}`);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }
});


client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();
  const command = client.prefixCommands.get(cmdName);
  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (e) {
    message.reply('Error executing that command.');
  }
});

const { REST, Routes } = require('discord.js');
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Registering slash commands...');
    const cmds = slashFiles.map(category => require(`./slashCommands/${category}/${file}`).data.toJSON());
    await rest.put(Routes.applicationCommands(clientId), { body: cmds });
  } catch (e) {
    console.error('Error registering slash commands:', e);
  }
})();

client.login(token);
