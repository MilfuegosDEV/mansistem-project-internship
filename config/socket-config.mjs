import { Server } from "socket.io";

export default (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("Usuario connectado:", socket.request.session.id);

    socket.on("disconnect", () => {
      console.log("Usuario desconectado:", socket.request.session.id);
    });
  });
  return io;
};
