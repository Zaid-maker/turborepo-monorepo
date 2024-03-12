import GamePlayer from "@/components/game";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";
import React from "react";

export default function GameJoin({
  searchParams,
  params,
}: {
  searchParams: { name?: string };
  params: { gameId: string };
}) {
  async function appendName(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;

    if (!name) return;

    redirect(`/game/${params.gameId}?name=${name}`);
  }

  if (!searchParams.name)
    return (
      <main className="mx-auto max-w-5xl w-full mt-10 p-5">
        <Card className="w-full flex flex-col p-10">
          <h2 className="font-bold text-4xl md:text-5xl">Enter your name</h2>
          <p className="text-gray-400 mt-5 text-lg">
            Before you join the game, we require you to provide a
            nickname/username. This nickname/username will be shown in the
            leaderboard and in the participants section.
          </p>

          <form action={appendName} className="mt-10">
            <Input
              type="text"
              placeholder="Name"
              name="name"
              className="text-xl px-5 py-7"
            />

            <Button type="submit" className="text-xl w-full mt-5 px-5 py-7">
              Join Game
            </Button>
          </form>
        </Card>
      </main>
    );

  return <GamePlayer name={searchParams.name} gameId={params.gameId} />;
}
