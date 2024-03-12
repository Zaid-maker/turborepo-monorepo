"use client";

import type { GameProps, GameStatus, Player, PlayerScore } from "@/types/types";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { Button } from "./ui/button";
import { LeaderboardCard } from "./leaderboard-card";

export default function GamePlayer({ gameId, name }: GameProps) {
  const [ioInstance, setIoInstance] = useState<Socket>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>("not-started");
  const [paragraph, setParagraph] = useState<string>("");
  const [host, setHost] = useState<string>("");
  const [inputParagraph, setInputParagraph] = useState<string>("");

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL as string, {
      transports: ["websocket"],
    });

    setIoInstance(socket);

    socket.emit("join-game", gameId, name);

    return () => {
      removeListeners();
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    setupListeners();
    return () => removeListeners();
  }, [ioInstance]);

  useEffect(() => {
    if (!ioInstance || gameStatus !== "in-progress") return;

    ioInstance.emit("player-typed", inputParagraph);
  }, [inputParagraph]);

  function setupListeners() {
    if (!ioInstance) return;

    ioInstance.on("connect", () => {
      console.log("connected");
    });

    ioInstance.on("players", (players: Player[]) => {
      console.log("received players");
      setPlayers(players);
    });

    ioInstance.on("player-joined", (player: Player) => {
      setPlayers((prev) => [...prev, player]);
    });

    ioInstance.on("player-left", (id: string) => {
      setPlayers((prev) => prev.filter((player) => player.id !== id));
    });

    ioInstance.on("player-score", ({ id, score }: PlayerScore) => {
      setPlayers((prev) =>
        prev.map((player) => {
          if (player.id === id) {
            return {
              ...player,
              score,
            };
          }
          return player;
        })
      );
    });

    ioInstance.on("game-started", (paragraph: string) => {
      setParagraph(paragraph);
      setGameStatus("in-progress");
    });

    ioInstance.on("game-finished", () => {
      setGameStatus("finished");
      setInputParagraph("");
    });

    ioInstance.on("new-host", (id: string) => {
      setHost(id);
    });

    ioInstance.on("error", (message: string) => {
      // toast.error(message);
    });
  }

  function removeListeners() {
    if (!ioInstance) return;

    ioInstance.off("connect");
    ioInstance.off("players");
    ioInstance.off("player-joined");
    ioInstance.off("player-left");
    ioInstance.off("player-score");
    ioInstance.off("game-started");
    ioInstance.off("game-finished");
    ioInstance.off("new-host");
    ioInstance.off("error");
  }

  return (
    <div className="w-screen p-10 grid grid-cols-1 lg:grid-cols-3 gap-20">
      <div className="w-full order-last lg:order-first">
        <h2 className="text-2xl font-medium mb-10 mt-10 lg:mt-0">
          Leaderboard
        </h2>
        <div className="flex flex-col gap-5 w-full">
          {players
            .sort((a, b) => b.score - a.score)
            .map((player, index) => (
              <LeaderboardCard
                key={player.id}
                player={player}
                rank={index + 1}
              />
            ))}
        </div>
      </div>

      <div className="lg:col-span-2 h-full">
        {gameStatus === "not-started" && (
          <div className="flex flex-col items-center justify-center p-10">
            <h1 className="text-2xl font-bold">
              Waiting for players to join...
            </h1>

            {host === ioInstance?.id && (
              <Button className="mt-10 px-20">Start Game</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
