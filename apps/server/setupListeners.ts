import { Server } from "socket.io";
import { Game } from "./classes/game";

export const rooms = new Map<string, Game>();

export function setupListeners(io: Server) {
  io.on("connection", (socket) => {
    console.log(`New connection - ${socket.id}`);

    socket.on("join-gane", (roomId: string, name: string) => {
      if (!roomId) {
        return socket.emit("error", "Invalid room ID");
      }

      if (!name) {
        return socket.emit("error", "Please provide nickname.");
      }

      socket.join(roomId);

      if (rooms.has(roomId)) {
        const game = rooms.get(roomId);

        if (!game) return socket.emit("error", "Game not found");

        game.joinPlayer(socket.id, name, socket);
      } else {
        const game = new Game(roomId, io, socket.id);

        rooms.set(roomId, game);

        game.joinPlayer(socket.id, name, socket);
      }
    });
  });
}
