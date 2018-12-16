module.exports = {
  name: 'ping',
  description: 'Ping the bot!',
  execute(message) {
    message.channel.send('Pong.');
  },
};
