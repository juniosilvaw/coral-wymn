import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Hymn queries
 */
export async function searchHymns(query: string, source?: string) {
  const db = await getDb();
  if (!db) return [];

  const { hymns: hymnsTable } = await import('../drizzle/schema');
  const { ilike, or, eq, and } = await import('drizzle-orm');

  const conditions = [
    ilike(hymnsTable.title, `%${query}%`),
    ilike(hymnsTable.lyrics, `%${query}%`),
  ];

  if (!isNaN(Number(query))) {
    conditions.push(eq(hymnsTable.number, Number(query)));
  }

  let whereCondition: any = or(...conditions);
  if (source) {
    whereCondition = and(whereCondition, eq(hymnsTable.source, source as any));
  }

  return db.select().from(hymnsTable).where(whereCondition).limit(50);
}

export async function getHymnById(hymnId: number) {
  const db = await getDb();
  if (!db) return null;

  const { hymns: hymnsTable } = await import('../drizzle/schema');
  const { eq } = await import('drizzle-orm');

  const result = await db.select().from(hymnsTable).where(eq(hymnsTable.id, hymnId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getVocalParts(hymnId: number) {
  const db = await getDb();
  if (!db) return [];

  const { vocalParts } = await import('../drizzle/schema');
  const { eq } = await import('drizzle-orm');

  return db.select().from(vocalParts).where(eq(vocalParts.hymnId, hymnId));
}

export async function getHymnAudios(hymnId: number) {
  const db = await getDb();
  if (!db) return [];

  const { hymnAudios } = await import('../drizzle/schema');
  const { eq } = await import('drizzle-orm');

  return db.select().from(hymnAudios).where(eq(hymnAudios.hymnId, hymnId));
}

/**
 * Favorites queries
 */
export async function getUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const { favorites, hymns: hymnsTable } = await import('../drizzle/schema');
  const { eq } = await import('drizzle-orm');

  return db
    .select({ favorite: favorites, hymn: hymnsTable })
    .from(favorites)
    .innerJoin(hymnsTable, eq(favorites.hymnId, hymnsTable.id))
    .where(eq(favorites.userId, userId));
}

export async function isFavorite(userId: number, hymnId: number) {
  const db = await getDb();
  if (!db) return false;

  const { favorites } = await import('../drizzle/schema');
  const { and, eq } = await import('drizzle-orm');

  const result = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.hymnId, hymnId)))
    .limit(1);

  return result.length > 0;
}

/**
 * Custom lists queries
 */
export async function getUserLists(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const { customLists } = await import('../drizzle/schema');
  const { eq } = await import('drizzle-orm');

  return db.select().from(customLists).where(eq(customLists.userId, userId));
}

export async function getListWithItems(listId: number) {
  const db = await getDb();
  if (!db) return null;

  const { customLists, listItems, hymns: hymnsTable } = await import('../drizzle/schema');
  const { eq } = await import('drizzle-orm');

  const list = await db.select().from(customLists).where(eq(customLists.id, listId)).limit(1);
  if (list.length === 0) return null;

  const items = await db
    .select({ item: listItems, hymn: hymnsTable })
    .from(listItems)
    .innerJoin(hymnsTable, eq(listItems.hymnId, hymnsTable.id))
    .where(eq(listItems.listId, listId))
    .orderBy(listItems.order);

  return { list: list[0], items };
}
