import { DVDScreenSaver } from "@/components/DVDScreenSaver";
import { NavbarLayout } from "@/components/layout/NavbarLayout";
import { useRouter } from "next/router";
import { trpc } from "src/utils/trpc";

export default function GameById() {
  const router = useRouter();
  const id = router.query.id;
  const { data, isLoading } = trpc.game.byId.useQuery(`${id}`, {
    queryKey: ["game.byId", `${id}`],
    enabled: !!id && typeof id === "string",
    onSuccess(data) {
      console.log("game.byId success", data);
    },
  });

  if (isLoading || !data || !id || typeof id !== "string") {
    return (
      <>
        <NavbarLayout />

        <main className="flex min-h-screen items-center justify-center bg-slate-600">
          <h3 className="flex justify-center">Loading...</h3>
        </main>
      </>
    );
  }

  const { markers } = data;

  return (
    <>
      <NavbarLayout />

      <main className="min-h-screen bg-slate-400">
        <h3 className="flex justify-center">{data.title}</h3>
        <DVDScreenSaver gameId={id} markers={markers} />
      </main>
    </>
  );
}
