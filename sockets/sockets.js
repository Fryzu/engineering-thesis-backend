const {
  openChannel,
  getChannelList,
  addUserToChannel,
  getChannelListeners,
  deleteChannelsOfUser
} = require("../state/channels");
const {
  addUser,
  deleteUser,
  getUsersList,
  getUserSocket
} = require("../state/users");

const eventTypes = {
  TEST: "test",
  NEW_USER: "addUser",
  GET_USER_LIST: "getUserList",
  OPEN_CHANNEL: "openChannel",
  GET_CHANNEL_LIST: "getChannelList",
  ADD_ME_TO_CHANNEL: "addMeToChannel",
  GET_CHANNEL_LISTENERS: "getChannelListeners",
  CLOSE_CHANNEL: "closeChannel",
  SEND_TO_USER: "sendToUser"
};

const HTTP_OK = 200;
const HTTP_BAD_REQUEST = 400;

function handleWebSocketConnections(socket, io) {
  console.log(`New connection on socket ${socket.id}`);

  // TEST EVENT EMITTER
  // let i = 0;
  // setInterval(() => {
  //   socket.emit("test", i);
  //   i += 1;
  // }, 3000);

  socket.use((packet, next) => {
    console.log("Request: ", packet);
    next();
  });

  socket.on("disconnect", () => {
    const { id } = socket;
    try {
      deleteUser(id);
      deleteChannelsOfUser(id);

      const users = getUsersList();
      const channels = getChannelList();
      socket.broadcast.emit(eventTypes.NEW_USER, {
        message: "User left the system",
        payload: {
          users,
          channels
        }
      });
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

      const users = getUsersList();
      const channels = getChannelList();
      socket.broadcast.emit(eventTypes.NEW_USER, {
        message: "New user in system",
        payload: {
          users,
          channels
        }
      });

      callback({
        status: HTTP_OK,
        message: "User has been added successfuly",
        payload: {
          users,
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

      const users = getUsersList();
      const channels = getChannelList();
      socket.broadcast.emit(eventTypes.NEW_USER, {
        message: "New channel in system",
        payload: {
          channels,
          users
        }
      });

      callback({
        status: HTTP_OK,
        message: `Successful created channel ${channelName}`,
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

  socket.on(eventTypes.CLOSE_CHANNEL, (_, callback) => {
    const { id } = socket;
    try {
      deleteChannelsOfUser(id);

      const channels = getChannelList();
      const users = getUsersList();
      socket.broadcast.emit(eventTypes.NEW_USER, {
        message: "One of channels has been deleted",
        payload: {
          channels,
          users
        }
      });

      callback({
        status: HTTP_OK,
        message: `Successfuly removed channel`,
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

  socket.on(eventTypes.SEND_TO_USER, (payload, callback) => {
    try {
      const { userName, messageType, message } = payload;

      const receiver = getUserSocket(userName);
      io.to(`${receiver}`).emit(eventTypes.SEND_TO_USER, {
        messageType,
        message
      });

      callback({
        status: HTTP_OK,
        message: "Successful forwarded message"
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
