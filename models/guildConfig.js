const mongoose = require("mongoose");

const guildConfigSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  autoRole: { type: String, default: null },
  antiLink: { type: Number, default: 0 },
  antiBot: { type: Number, default: 0 },
  antiWebhook: { type: Number, default: 0 },
  botIds: { type: [String], required: true },
  channelId: { type: String, required: true },
  messageId: { type: String, required: true },
  whitelistedRoles: { type: [String], default: [] },
  joinVoice: { type: Boolean, default: false },
});

module.exports = mongoose.model('GuildConfig', guildConfigSchema);
