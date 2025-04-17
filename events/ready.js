const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    client.user.setStatus('idle'); 
    client.user.setActivity('discord.gg/celestail', { type: ActivityType.Custom }); 
  },
};
