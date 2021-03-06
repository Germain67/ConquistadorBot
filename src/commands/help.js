const _ = require('lodash');
const logger = require('../components/logger');
const { prefix } = require('../../config');

module.exports = {
  name: 'help',
  description: 'List all of my commands or info about a specific command.',
  aliases: ['commands'],
  usage: '[command name]',
  async execute(message, args) {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
      data.push('Here\'s a list of all my commands:');
      data.push(commands.map(command => command.name).join(', '));
      data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

      try {
        await message.author.send(data, { split: true });
        message.reply('I\'ve sent you a DM with all my commands!');
      } catch (error) {
        logger.error(`Could not send help DM to ${message.author.tag}.\n`, error);
        message.reply('it seems like I can\'t DM you!');
      }
      return true;
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply('that\'s not a valid command!');
    }

    data.push(`**Name:** ${command.name}`);
    if (command.aliases) {
      data.push(`**Aliases:** ${command.aliases.join(', ')}`);
    }
    data.push(`**Description:** ${command.description}`);
    data.push(`**Usage:** ${prefix}${command.name} ${_.get(command, 'usage', '')}`);

    message.channel.send(data, { split: true });
    return true;
  },
};
