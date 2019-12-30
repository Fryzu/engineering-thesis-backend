const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const { SERVER_PORT } = require("./config");
const router = require("./router");
const { handleWebSocketConnections } = require("./sockets/sockets");

// Creating app and server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Handling WebSockets connections
io.on("connect", socket => handleWebSocketConnections(socket, io));

app.use(router);

server.listen(SERVER_PORT, () => {
  console.log("Server starts on port", SERVER_PORT);
});
