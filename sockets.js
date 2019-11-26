function handleWebSocketConnections(socket) {
  console.log(`New connection on socket ${socket.id}`);
  socket.on("test", ({ testMessage }, callback) => {
    console.log(`Test connection on socket ${socket.id}`);
    callback(testMessage);
  });
}

module.exports = { handleWebSocketConnections };
