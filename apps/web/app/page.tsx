"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const router = useRouter();

  function joinGame(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const inviteCode = formData.get("inviteCode") as string;

    if (!inviteCode) return;

    router.push(`/game/${inviteCode}`);
  }

  function createGame() {
    const inviteCode = uuidv4();

    router.push(`/game/${inviteCode}`);
  }

  return (
    <main className="w-full mx-auto max-w-5xl p-5">
      <h1 className="font-bold text-4xl mt-10">Typing Battle</h1>
      <p className="mt-5 text-gray-400 text-lg">
        Go on a typing battle with your friends and see which one of you types
        the most in under a minute! Create or join a game to get started. You
        can play with yourself too.
      </p>
      <Card className="p-5 mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 flex flex-col justify-between">
          <div>
            <h2 className="font-medium text-2xl">Create Game</h2>
            <p className="text-gray-400 mt-5">
              Create a game and invite your friends to join you and race you to
              a typing battle! You will receive an invite code once you create a
              game. You will be the host of the game.
            </p>
          </div>

          <div>
            <Button className="mt-5 w-full" onClick={createGame}>
              Create Game
            </Button>
          </div>
        </div>

        <div className="p-5 flex flex-col justify-between">
          <div>
            <h2 className="font-medium text-2xl">Join Game</h2>
            <p className="text-gray-400 mt-5">
              Enter your invite code and join your friends to battle them in a
              typing race. Let the best person win!
            </p>
          </div>

          <div className="mt-5">
            <form onSubmit={joinGame}>
              <Input type="text" placeholder="Invite code" name="inviteCode" />
              <Button className="mt-3 w-full">Join Game</Button>
            </form>
          </div>
        </div>
      </Card>
    </main>
  );
}
