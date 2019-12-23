const { addUser, deleteUser, getUsersList } = require("../state/users");

const eventTypes = {
  TEST: "test",
  NEW_USER: "addUser",
  GET_USER_LIST: "getUserList",
  SEND_TO_USER: "sendToUser"
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
      console.warn(users);
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
}

module.exports = { handleWebSocketConnections, eventTypes };
