const { addUser } = require("../state/users");

const eventTypes = {
  TEST: "test",
  NEW_USER: "addUser"
};

const HTTP_OK = 200;
const HTTP_BAD_REQUEST = 400;

function handleWebSocketConnections(socket) {
  console.log(`New connection on socket ${socket.id}`);

  socket.use((packet, next) => {
    console.log("Request: ", packet);
    next();
  });

  // socket.on("disconnect", () => {});

  socket.on(eventTypes.TEST, ({ testMessage }, callback) => {
    callback(testMessage);
  });

  socket.on(eventTypes.NEW_USER, (payload, callback) => {
    try {
      const { userName } = payload;
      addUser(socket.id, userName);
      callback({
        status: HTTP_OK,
        message: "User has been added succesfully"
      });
    } catch (error) {
      callback({
        status: HTTP_BAD_REQUEST,
        message: error
      });
    }
  });
}

module.exports = { handleWebSocketConnections };
