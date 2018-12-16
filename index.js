const Discord = require('discord.js');
const commandFiles = require('require-all')(`${__dirname}/commands`);
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const { commands } = client;

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
  const name = args.shift().toLowerCase();


  const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

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
