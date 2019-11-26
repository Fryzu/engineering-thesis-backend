const { addUser } = require("../state/users");

const eventTypes = {
  TEST: "test",
  NEW_USER: "newUser"
};

function handleWebSocketConnections(socket) {
  console.log(`New connection on socket ${socket.id}`);

  socket.use((packet, next) => {
    console.log("Incoming packet", packet);
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
    } catch (error) {
      callback(error);
    }
  });
}

module.exports = { handleWebSocketConnections };
