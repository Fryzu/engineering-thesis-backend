const {
  openChannel,
  getChannelList,
  addUserToChannel,
  getChannelListeners
} = require("../state/channels");
const { addUser, deleteUser, getUsersList } = require("../state/users");

const eventTypes = {
  TEST: "test",
  NEW_USER: "addUser",
  GET_USER_LIST: "getUserList",
  OPEN_CHANNEL: "openChannel",
  GET_CHANNEL_LIST: "getChannelList",
  ADD_ME_TO_CHANNEL: "addMeToChannel",
  GET_CHANNEL_LISTENERS: "getChannelListeners"
};

const HTTP_OK = 200;
const HTTP_BAD_REQUEST = 400;

function handleWebSocketConnections(socket) {
  console.log(`New connection on socket ${socket.id}`);

  socket.use((packet, next) => {
    console.log("Request: ", packet);
    next();
  });

  socket.on("disconnect", () => {
    const { id } = socket;
    try {
      deleteUser(id);
    } catch (error) {
      console.log(`Disconnection error: ${error}`);
    }
  });

  socket.on(eventTypes.TEST, ({ testMessage }, callback) => {
    callback(testMessage);
  });

  socket.on(eventTypes.NEW_USER, (payload, callback) => {
    try {
      const { userName } = payload;
      addUser(socket.id, userName);
      callback({
        status: HTTP_OK,
        message: "User has been added successfuly"
      });
    } catch (error) {
      callback({
        status: HTTP_BAD_REQUEST,
        message: error
      });
    }
  });

  socket.on(eventTypes.GET_USER_LIST, (_, callback) => {
    try {
      const users = getUsersList();
      callback({
        status: HTTP_OK,
        message: "Successful user list get",
        payload: {
          users
        }
      });
    } catch (error) {
      callback({
        status: HTTP_BAD_REQUEST,
        message: error
      });
    }
  });

  socket.on(eventTypes.OPEN_CHANNEL, (payload, callback) => {
    try {
      const { channelName } = payload;
      openChannel(channelName, socket.id);
      callback({
        status: HTTP_OK,
        message: `Successful created channel ${channelName}`
      });
    } catch (error) {
      callback({
        status: HTTP_BAD_REQUEST,
        message: error
      });
    }
  });

  socket.on(eventTypes.GET_CHANNEL_LIST, (_, callback) => {
    try {
      const channels = getChannelList();
      callback({
        status: HTTP_OK,
        message: "Successful channel list get",
        payload: {
          channels
        }
      });
    } catch (error) {
      callback({
        status: HTTP_BAD_REQUEST,
        message: error
      });
    }
  });

  socket.on(eventTypes.ADD_ME_TO_CHANNEL, (payload, callback) => {
    try {
      const { channelName } = payload;
      addUserToChannel(socket.id, channelName);
      callback({
        status: HTTP_OK,
        message: `Successfuly added user to ${channelName} listeners`
      });
    } catch (error) {
      console.warn(error);
      callback({
        status: HTTP_BAD_REQUEST,
        message: error
      });
    }
  });

  socket.on(eventTypes.GET_CHANNEL_LISTENERS, (payload, callback) => {
    try {
      const { channelName } = payload;

      const listeners = getChannelListeners(channelName);
      callback({
        status: HTTP_OK,
        message: "Successful channel listeners get",
        payload: {
          listeners
        }
      });
    } catch (error) {
      callback({
        status: HTTP_BAD_REQUEST,
        message: error
      });
    }
  });
}

module.exports = { handleWebSocketConnections, eventTypes };
