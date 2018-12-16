module.exports = {
  name: 'random',
  aliases: ['rand', 'choose', 'bo'],
  description: 'Random pick in a list in X roll',
  usage: '[1-3-5] [choice1] ; [choice2] ... ; ... (choiceN)',
  minArgs: 2,
  execute(message, args) {
    const amount = parseInt(args.shift(), 10);
    const choices = args.join(' ').split(';').map(value => ({ value, count: 0 }));

    if (![1, 3, 5].includes(amount)) {
      return message.reply('Amount must be 1, 3 or 5');
    }

    for (let i = 0; i < amount; i += 1) {
      const choice = choices[Math.floor(Math.random() * choices.length)];
      message.channel.send(choice.value);
      choice.count += 1;
    }

    const max = Math.max(...choices.map(o => o.count));
    const selectedItems = choices.filter(a => a.count === max).map(a => a.value);

    return message.channel.send(`Selected item(s) ${selectedItems} : picked ${max} out of ${amount} times`);
  },
};
