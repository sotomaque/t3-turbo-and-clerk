import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const gameRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.game.findMany();
  }),
  byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.game.findFirst({
      where: { id: input },
      include: { markers: true, players: true },
    });
  }),
  create: protectedProcedure
    .input(z.object({ title: z.string(), description: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Extract the input fields
      const { title, description } = input;

      // Create the game with the provided title and description, owned by the authenticated user
      const game = await ctx.prisma.game.create({
        data: {
          title,
          description,
          owner: { connect: { id: ctx.user.id } },
        },
      });

      return game;
    }),

  join: protectedProcedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const game = await ctx.prisma.game.update({
        where: { id: input.gameId },
        data: { players: { connect: { id: ctx.user.id } } },
        include: { players: true },
      });
      return game;
    }),
  // add marker to game
  addMarker: protectedProcedure
    .input(
      z.object({
        gameId: z.string(),
        marker: z.object({
          x: z.number(),
          y: z.number(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { gameId, marker } = input;

      // First, check if the game exists
      const game = await ctx.prisma.game.findUnique({
        where: { id: gameId },
      });
      console.log({ game });
      if (!game) {
        throw new Error(`Game with ID ${gameId} not found`);
      }

      // Create the marker in the database
      const createdMarker = await ctx.prisma.marker.create({
        data: {
          x: marker.x,
          y: marker.y,
          ownerId: gameId,
        },
      });

      // Update the game's markers array with the new marker
      const updatedGame = await ctx.prisma.game.update({
        where: { id: gameId },
        data: {
          markers: {
            connect: {
              id: createdMarker.id,
            },
          },
        },
      });

      return updatedGame;
    }),
});
