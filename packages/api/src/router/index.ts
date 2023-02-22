import { router } from "../trpc";
import { postRouter } from "./post";
import { authRouter } from "./auth";
import { gameRouter } from "./game";

export const appRouter = router({
  post: postRouter,
  auth: authRouter,
  game: gameRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
