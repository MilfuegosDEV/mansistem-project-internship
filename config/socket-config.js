// config/socket-config.js

const socketIO = require("socket.io");

function configureSocket(server) {
  const io = new socketIO.Server(server);

  io.on("connection", (socket) => {
    const session = socket.request.session;
    console.log(session.id);

    socket.on("disconnect", () => {
      console.log("Usuario desconectado", socket.request.session.id);
    });
  });

  return io;
}

module.exports = configureSocket;
