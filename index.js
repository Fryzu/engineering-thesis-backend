const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const { SERVER_PORT } = require("./config");
const router = require("./router");
const { handleWebSocketConnections } = require("./sockets");

// Creating app and server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Handling WebSockets connections
io.on("connect", handleWebSocketConnections);

app.use(router);

server.listen(SERVER_PORT, () => {
  console.log("Server runs on port", SERVER_PORT);
});
