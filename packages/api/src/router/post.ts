import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";

// 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

export const postRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
  byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.post.findFirst({ where: { id: input } });
  }),
  create: protectedProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({ data: input });
    }),
  createCompletion: publicProcedure.query(async () => {
    //
    const configuration = new Configuration({
      organization: "org-lPwVCTYX5pzNm0LWZs8hPE8m",
      apiKey: "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",
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "Say this is a test",
      temperature: 0,
      max_tokens: 7,
    });

    console.log({ response });

    return response.data;
  }),
});
