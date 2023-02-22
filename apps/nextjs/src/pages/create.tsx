// page with a form
// for a gameName
// and a button
// should redirect to /game/:gameId
// where gameId is the id of the game (uuid for now)

import { NavbarLayout } from "@/components/layout/NavbarLayout";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "src/utils/trpc";

export default function Create() {
  const [name, setName] = useState("");
  const router = useRouter();
  const { mutateAsync, isLoading } = trpc.game.create.useMutation({
    onSuccess(data) {
      router.push(`/game/${data.id}`);
    },
  });

  const onClick = async ({
    description,
    title,
  }: {
    description: string;
    title: string;
  }) => {
    await mutateAsync({
      description,
      title,
    });
  };

  return (
    <>
      <NavbarLayout />

      <main className="flex min-h-screen items-center justify-center bg-slate-600">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-200"
            >
              Name
            </label>
            <div className="flex">
              <input
                type="name"
                name="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="rounded-md border border-gray-300 p-2"
              />
              <button
                className="ml-4 rounded-md border-2 border-dashed p-2 text-slate-200"
                disabled={isLoading}
                onClick={async () => {
                  if (!name.trim()) return;

                  onClick({
                    description: "description",
                    title: name,
                  });
                }}
              >
                {isLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
