const Discord = require('discord.js');
const commandFiles = require('require-all')(`${__dirname}/commands`);
const { performance } = require('perf_hooks');
const logger = require('./components/logger');
const { prefix, token } = require('./config');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const { commands } = client;

Object.keys(commandFiles).forEach((name) => {
  const command = commandFiles[name];
  client.commands.set(command.name, command);
});

client.once('ready', () => {
  logger.info('Ready!');
});

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return false;

  logger.info(`${message.author.username}> ${message.content}`);

  const args = message.content.slice(prefix.length).split(/ +/);
  const name = args.shift().toLowerCase();
  const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

  if (!command) return false;

  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply('I can\'t execute that command inside DMs!');
  }

  if (args.length < command.minArgs) {
    return message.channel.send(`Command usage: ${prefix}${command.name} ${command.usage}`);
  }

  const startTime = performance.now();
  try {
    await command.execute(message, args);
  } catch (error) {
    logger.error(error);
    message.reply('there was an error trying to execute that command!');
  }

  const executionTime = Math.trunc(performance.now() - startTime);
  logger.debug(`Execution time: ${executionTime}ms`);

  return true;
});

client.login(token);
