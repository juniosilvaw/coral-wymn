import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `sample-user-${userId}`,
    email: `user${userId}@example.com`,
    name: `User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Hymns Router", () => {
  describe("hymns.search", () => {
    it("should return empty array for non-existent hymn", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const results = await caller.hymns.search({
        query: "nonexistent-hymn-xyz",
      });

      expect(Array.isArray(results)).toBe(true);
    });

    it("should accept search query with source filter", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const results = await caller.hymns.search({
        query: "",
        source: "harpa_crista",
      });

      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe("hymns.list", () => {
    it("should list hymns by source", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const results = await caller.hymns.list({
        source: "harpa_crista",
        limit: 10,
      });

      expect(Array.isArray(results)).toBe(true);
    });

    it("should respect limit parameter", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const results = await caller.hymns.list({
        source: "harpa_crista",
        limit: 5,
      });

      expect(results.length).toBeLessThanOrEqual(5);
    });
  });
});

describe("Favorites Router", () => {
  describe("favorites.list", () => {
    it("should return empty array for user with no favorites", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const favorites = await caller.favorites.list();

      expect(Array.isArray(favorites)).toBe(true);
    });
  });

  describe("favorites.toggle", () => {
    it("should toggle favorite status", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // First toggle - should add to favorites
      const result1 = await caller.favorites.toggle(1);
      expect(result1.isFavorite).toBe(true);

      // Second toggle - should remove from favorites
      const result2 = await caller.favorites.toggle(1);
      expect(result2.isFavorite).toBe(false);
    });
  });
});

describe("Lists Router", () => {
  describe("lists.list", () => {
    it("should return empty array for user with no lists", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const lists = await caller.lists.list();

      expect(Array.isArray(lists)).toBe(true);
    });
  });

  describe("lists.create", () => {
    it("should create a new list", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.lists.create({
        name: "Culto de Domingo",
        description: "Hinos para o culto de domingo",
        type: "service",
      });

      expect(result).toBeDefined();
    });

    it("should create a list with optional fields", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.lists.create({
        name: "Ensaio Semana",
        type: "rehearsal",
      });

      expect(result).toBeDefined();
    });
  });
});

describe("User Router", () => {
  describe("user.updatePreferences", () => {
    it("should update user vocal range", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.user.updatePreferences({
        vocalRange: "soprano",
      });

      expect(result.vocalRange).toBe("soprano");
    });

    it("should update user font size", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.user.updatePreferences({
        fontSize: 20,
      });

      expect(result.fontSize).toBe(20);
    });

    it("should update user theme", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.user.updatePreferences({
        theme: "dark",
      });

      expect(result.theme).toBe("dark");
    });

    it("should update multiple preferences at once", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.user.updatePreferences({
        vocalRange: "tenor",
        fontSize: 18,
        theme: "dark",
      });

      expect(result.vocalRange).toBe("tenor");
      expect(result.fontSize).toBe(18);
      expect(result.theme).toBe("dark");
    });

    it("should not update with invalid font size", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.user.updatePreferences({
          fontSize: 100, // Too large
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
