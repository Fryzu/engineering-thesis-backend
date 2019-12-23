const channels = {};

/**
 * Creates new channel
 * @param {string} channelName
 * @param {string} author author socket id
 */
const openChannel = (channelName, author) => {
  if (channelName in channels) throw "Channel already exists";
  if (!channelName) {
    throw "Incorrect channel name";
  }
  channels[channelName] = {
    author,
    listeners: []
  };
};

const deleteChannel = channelName => {
  if (!(channelName in channels)) throw "No such channel";

  delete channels[channelName];
};

const getChannelList = () => {};

const addUserToChannel = () => {};

const getChannelListeners = () => {};

module.exports = { openChannel };
