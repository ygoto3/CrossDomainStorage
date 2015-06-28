var Channel = require('./Channel.js');

var CrossDomainStorage = {

  channels: {},

  newChannel: function (channelName, url) {
    var _channel = new Channel(channelName, url);
    this.channels[channelName] = _channel;
    return _channel;
  },

  getChannel: function (channelName) {
    return this.channels[channelName];
  }

};

module.exports = CrossDomainStorage;
