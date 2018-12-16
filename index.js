const Discord = require('discord.js');
const commandFiles = require('require-all')(`${__dirname}/commands`);
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

Object.keys(commandFiles).forEach((name) => {
  const command = commandFiles[name];
  client.commands.set(command.name, command);
});

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return false;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.find(
    cmd => cmd.name === commandName || (cmd.aliases && cmd.aliases.includes(commandName)),
  );

  if (!command) return false;

  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply('I can\'t execute that command inside DMs!');
  }

  if (args.length < command.minArgs) {
    return message.channel.send(`Command usage: ${prefix}${command.name} ${command.usage}`);
  }

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
  return true;
});

client.login(token);
