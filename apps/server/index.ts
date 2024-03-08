import { createServer } from "http";
import { Server } from "socket.io";
import { setupListeners } from "./setupListeners";

const PORT = process.env.PORT || 8080;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

setupListeners(io);

httpServer.listen(PORT, () =>
  console.log(`Socket server started listening on ${PORT}`)
);
