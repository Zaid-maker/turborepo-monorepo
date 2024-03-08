import { Server, Socket } from "socket.io";
import { generateParagraph } from "../utils/generateParagraph";
import { rooms } from "../setupListeners";

export class Game {
  gameStatus: "not-started" | "in-progress" | "finished";
  gameId: string;
  players: {
    id: string;
    score: number;
    name: string;
  }[];
  io: Server;
  gameHost: string;
  paragraph: string;

  constructor(id: string, io: Server, host: string) {
    this.gameId = id;
    this.players = [];
    this.io = io;
    this.gameHost = host;
    this.gameStatus = "not-started";
    this.paragraph = "";
  }

  setupListeners(socket: Socket) {
    socket.on("start-game", async () => {
      if (this.gameStatus === "in-progress")
        return socket.emit("error", "The game has already started");

      if (this.gameHost !== socket.id)
        return socket.emit(
          "error",
          "You are not the host of the Game. Only the host can start the game"
        );

      for (const player of this.players) {
        player.score = 0;
      }

      this.io.to(this.gameId).emit("players", this.players);

      this.gameStatus = "in-progress";

      const paragraph = await generateParagraph();
      this.paragraph = paragraph;
      this.io.to(this.gameId).emit("game-started", paragraph);

      // Set a timer for 60 seconds
      setTimeout(() => {
        this.gameStatus = "finished";
        this.io.to(this.gameId).emit("game-finished");
        this.io.to(this.gameId).emit("players", this.players);
      }, 60000);
    });

    socket.on("player-typed", (typed: string) => {
      if (this.gameStatus !== "in-progress")
        return socket.emit("error", "The game has not started yet");

      const splittedParagraph = this.paragraph.split(" ");
      const splittedTyped = typed.split(" ");

      let score = 0;

      for (let i = 0; i < splittedTyped.length; i++) {
        if (splittedTyped[i] === splittedParagraph[i]) {
          score++;
        } else {
          break;
        }
      }

      const player = this.players.find((player) => player.id === socket.id);

      if (player) {
        player.score = score;
      }

      this.io.to(this.gameId).emit("player-score", { id: socket.id, score });
    });

    socket.on("leave", () => {
      if (socket.id === this.gameHost) {
        this.players = this.players.filter((player) => player.id !== socket.id);

        if (this.players.length !== 0) {
          this.gameHost = this.players[0].id;
          this.io.to(this.gameId).emit("new-host", this.gameHost);
          this.io.to(this.gameId).emit("player-left", socket.id);
        } else {
          // Delete the game if the host leaves and there are no players
          rooms.delete(this.gameId);
        }
      }

      socket.leave(this.gameId);
      this.players = this.players.filter((player) => player.id !== socket.id);
      this.io.to(this.gameId).emit("player-left", socket.id);
    });

    socket.on("disconnect", () => {
      if (socket.id === this.gameHost) {
        this.players = this.players.filter((player) => player.id !== socket.id);

        if (this.players.length !== 0) {
          this.gameHost = this.players[0].id;
        } else {
          // Delete the game if the host leaves and there are no players
          rooms.delete(this.gameId);
        }
      }

      socket.leave(this.gameId);
      this.players = this.players.filter((player) => player.id !== socket.id);
    });
  }

  joinPlayer(id: string, name: string, socket: Socket) {
    if (this.gameStatus === "not-started")
      return socket.emit(
        "error",
        "Game has already started, please wait for it to end before joining!"
      );

    this.players.push({ id, name, score: 0 });

    this.io.to(this.gameId).emit("player-joined", {
      id,
      name,
      score: 0,
    });

    socket.emit("player", this.players);
    socket.emit("new-host", this.gameHost);

    this.setupListeners(socket);
  }
}
