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

const deleteChannelsOfUser = userName => {
  Object.keys(channels).forEach(channel => {
    if (channels[channel].author === userName) {
      delete channels[channel];
    }
  });
};

const deleteChannel = channelName => {
  if (!(channelName in channels)) throw "No such channel";

  delete channels[channelName];
};

const getChannelList = () => {
  return Object.keys(channels);
};

/**
 * Adds a user to channel listeners
 * @param {string} userID user socket ID
 * @param {string} channelName
 */
const addUserToChannel = (userID, channelName) => {
  if (!(channelName in channels)) throw "No such channel";

  const { listeners } = channels[channelName];
  if (userID in listeners) throw "User already in channel";

  listeners.push(userID);
};

/**
 * Returns channel listeners
 * @param {string} channelName
 */
const getChannelListeners = channelName => {
  return channels[channelName].listeners;
};

module.exports = {
  openChannel,
  getChannelList,
  addUserToChannel,
  getChannelListeners,
  deleteChannelsOfUser
};
