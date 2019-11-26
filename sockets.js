function handleWebSocketConnections(socket) {
  socket.on("test", () => {
    console.warn("Test connection");
  });
}

module.exports = { handleWebSocketConnections };
