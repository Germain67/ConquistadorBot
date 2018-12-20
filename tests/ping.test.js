const ping = require('../commands/ping');

test('Except pong to be sent', () => {
  const callback = {
    channel: {
      send: jest.fn(),
    },
  };
  ping.execute(callback);
  expect(callback.channel.send).toBeCalledTimes(1);
  expect(callback.channel.send).toBeCalledWith('Pong.');
});
