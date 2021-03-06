const logger = require('../components/logger');

module.exports = {
  name: 'prune',
  description: 'Prune up to 99 messages.',
  usage: '[<1-100>]',
  minArgs: 1,
  async execute(message, args) {
    const amount = parseInt(args[0], 10) + 1;

    if (Number.isNaN(amount)) {
      return message.reply('that doesn\'t seem to be a valid number.');
    }
    if (amount <= 1 || amount > 100) {
      return message.reply('you need to input a number between 1 and 99.');
    }

    try {
      await message.channel.bulkDelete(amount, true);
    } catch (error) {
      logger.error(error);
      message.channel.send('there was an error trying to prune messages in this channel!');
    }
    return true;
  },
};
