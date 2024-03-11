"use client";

import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

export default function GamePlayer() {
  const [ioInstance, setIoInstance] = useState<Socket>();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL as string, {
      transports: ["websocket"],
    });

    setIoInstance(socket);

    //socket.emit("join-game", gameId, name);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="w-screen p-10 grid grid-cols-1 lg:grid-cols-3 gap-20">
      <div className="w-full order-last lg:order-first">
        <h2 className="text-2xl font-medium mb-10 mt-10 lg:mt-0">
          Leaderboard
        </h2>
      </div>
    </div>
  );
}
