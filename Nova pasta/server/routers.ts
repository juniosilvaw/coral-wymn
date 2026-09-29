import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { seedAdminRouter } from "./seed-admin";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  seedAdmin: seedAdminRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  hymns: router({
    search: publicProcedure
      .input(z.object({
        query: z.string(),
        source: z.enum(['harpa_crista', 'cantor_cristao', 'salmos']).optional(),
      }))
      .query(async ({ input }) => {
        const { searchHymns } = await import('./db');
        return searchHymns(input.query, input.source);
      }),

    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const { getHymnById, getVocalParts, getHymnAudios } = await import('./db');
        const hymn = await getHymnById(input);
        if (!hymn) return null;
        const vocalParts = await getVocalParts(input);
        const audios = await getHymnAudios(input);
        return { hymn, vocalParts, audios };
      }),

    list: publicProcedure
      .input(z.object({
        source: z.enum(['harpa_crista', 'cantor_cristao', 'salmos']),
        limit: z.number().default(50),
      }))
      .query(async ({ input }) => {
        const db = await import('./db').then(m => m.getDb());
        if (!db) return [];
        const { hymns } = await import('../drizzle/schema');
        const { eq } = await import('drizzle-orm');
        return db.select().from(hymns).where(eq(hymns.source, input.source as any)).limit(input.limit);
      }),
  }),

  favorites: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserFavorites } = await import('./db');
      return getUserFavorites(ctx.user.id);
    }),

    toggle: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input: hymnId }) => {
        const { isFavorite } = await import('./db');
        const db = await import('./db').then(m => m.getDb());
        if (!db) throw new Error('Database not available');
        const { favorites } = await import('../drizzle/schema');
        const { eq, and } = await import('drizzle-orm');

        const isFav = await isFavorite(ctx.user.id, hymnId);
        if (isFav) {
          await db.delete(favorites).where(
            and(eq(favorites.userId, ctx.user.id), eq(favorites.hymnId, hymnId))
          );
        } else {
          await db.insert(favorites).values({ userId: ctx.user.id, hymnId });
        }
        return { isFavorite: !isFav };
      }),
  }),

  lists: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserLists } = await import('./db');
      return getUserLists(ctx.user.id);
    }),

    getWithItems: protectedProcedure
      .input(z.number())
      .query(async ({ input: listId }) => {
        const { getListWithItems } = await import('./db');
        return getListWithItems(listId);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        type: z.enum(['service', 'rehearsal', 'custom']).default('custom'),
        scheduledDate: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await import('./db').then(m => m.getDb());
        if (!db) throw new Error('Database not available');
        const { customLists } = await import('../drizzle/schema');

        const result = await db.insert(customLists).values({
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
          type: input.type as any,
          scheduledDate: input.scheduledDate,
        });
        return result;
      }),

    addItem: protectedProcedure
      .input(z.object({
        listId: z.number(),
        hymnId: z.number(),
        order: z.number(),
      }))
      .mutation(async ({ input }) => {
        const db = await import('./db').then(m => m.getDb());
        if (!db) throw new Error('Database not available');
        const { listItems } = await import('../drizzle/schema');

        return db.insert(listItems).values({
          listId: input.listId,
          hymnId: input.hymnId,
          order: input.order,
        });
      }),

    removeItem: protectedProcedure
      .input(z.number())
      .mutation(async ({ input: itemId }) => {
        const db = await import('./db').then(m => m.getDb());
        if (!db) throw new Error('Database not available');
        const { listItems } = await import('../drizzle/schema');
        const { eq } = await import('drizzle-orm');

        return db.delete(listItems).where(eq(listItems.id, itemId));
      }),
  }),

  user: router({
    updatePreferences: protectedProcedure
      .input(z.object({
        vocalRange: z.enum(['soprano', 'contralto', 'tenor', 'baixo']).optional(),
        fontSize: z.number().min(12).max(32).optional(),
        theme: z.enum(['light', 'dark']).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await import('./db').then(m => m.getDb());
        if (!db) throw new Error('Database not available');
        const { users } = await import('../drizzle/schema');
        const { eq } = await import('drizzle-orm');

        const updateData: any = {};
        if (input.vocalRange) updateData.vocalRange = input.vocalRange;
        if (input.fontSize) updateData.fontSize = input.fontSize;
        if (input.theme) updateData.theme = input.theme;

        if (Object.keys(updateData).length === 0) return ctx.user;

        await db.update(users).set(updateData).where(eq(users.id, ctx.user.id));
        return { ...ctx.user, ...updateData };
      }),
  }),
});

export type AppRouter = typeof appRouter;
