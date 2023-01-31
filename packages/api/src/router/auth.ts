import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
  // https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions/shared-extensions#install-a-packaged-extension
  createUser: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      return await ctx.prisma.user.upsert({
        where: { id: `${ctx.user.id}` },
        update: {
          lastName: `${ctx.user.lastName}`,
          firstName: `${ctx.user.firstName}`,
          profileImageUrl: `${ctx.user.profileImageUrl}`,
          username: `${ctx.user.username}`,
        },
        create: {
          lastName: `${ctx.user.lastName}`,
          firstName: `${ctx.user.firstName}`,
          profileImageUrl: `${ctx.user.profileImageUrl}`,
          username: `${ctx.user.username}`,
        },
      });
    } catch (error) {
      console.error("Error creating user", error);
    }
  }),
});
