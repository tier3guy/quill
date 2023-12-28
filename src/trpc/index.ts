import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import { currentUser } from "@clerk/nextjs/server";
import { privateProcedure, publicProcedure, router } from "@/trpc/trpc";
import { z } from "zod";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const user = await currentUser();

    if (!user || !user.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    // Check if the user is present in the db
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.emailAddresses[0].emailAddress,
        },
      });
    }

    return {
      success: true,
    };
  }),
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const res = await db.file.findMany({
      where: {
        userId: userId,
      },
    });
    return res;
  }),
  getFile: privateProcedure
    .input(
      z.object({
        key: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = db.file.findFirst({
        where: {
          key: input.key,
          userId: userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });
      return file;
    }),
  deleteFile: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      await db.file.delete({
        where: {
          id: input.id,
        },
      });

      return file;
    }),
});

export type AppRouter = typeof appRouter;
