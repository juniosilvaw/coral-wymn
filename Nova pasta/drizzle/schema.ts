import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, json } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // User preferences
  vocalRange: mysqlEnum("vocalRange", ["soprano", "contralto", "tenor", "baixo"]),
  fontSize: int("fontSize").default(16).notNull(),
  theme: mysqlEnum("theme", ["light", "dark"]).default("light").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Hymns table - stores all hymns from Harpa Cristã, Cantor Cristão and Salmos
 */
export const hymns = mysqlTable("hymns", {
  id: int("id").autoincrement().primaryKey(),
  number: int("number").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  source: mysqlEnum("source", ["harpa_crista", "cantor_cristao", "salmos"]).notNull(),
  lyrics: text("lyrics").notNull(),
  tonality: varchar("tonality", { length: 50 }),
  composer: varchar("composer", { length: 255 }),
  author: varchar("author", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Hymn = typeof hymns.$inferSelect;
export type InsertHymn = typeof hymns.$inferInsert;

/**
 * Vocal parts for hymns - stores the specific part for each vocal range
 */
export const vocalParts = mysqlTable("vocalParts", {
  id: int("id").autoincrement().primaryKey(),
  hymnId: int("hymnId").notNull(),
  vocalRange: mysqlEnum("vocalRange", ["soprano", "contralto", "tenor", "baixo"]).notNull(),
  lyrics: text("lyrics").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VocalPart = typeof vocalParts.$inferSelect;
export type InsertVocalPart = typeof vocalParts.$inferInsert;

/**
 * Audio files for hymns - stores audio URLs for each vocal range
 */
export const hymnAudios = mysqlTable("hymnAudios", {
  id: int("id").autoincrement().primaryKey(),
  hymnId: int("hymnId").notNull(),
  vocalRange: mysqlEnum("vocalRange", ["soprano", "contralto", "tenor", "baixo", "full"]).notNull(),
  audioUrl: text("audioUrl").notNull(),
  duration: int("duration"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HymnAudio = typeof hymnAudios.$inferSelect;
export type InsertHymnAudio = typeof hymnAudios.$inferInsert;

/**
 * Favorites - marks hymns as favorites for users
 */
export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  hymnId: int("hymnId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

/**
 * Custom lists - user-created lists for services or rehearsals
 */
export const customLists = mysqlTable("customLists", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["service", "rehearsal", "custom"]).default("custom").notNull(),
  scheduledDate: timestamp("scheduledDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustomList = typeof customLists.$inferSelect;
export type InsertCustomList = typeof customLists.$inferInsert;

/**
 * List items - hymns in a custom list with order
 */
export const listItems = mysqlTable("listItems", {
  id: int("id").autoincrement().primaryKey(),
  listId: int("listId").notNull(),
  hymnId: int("hymnId").notNull(),
  order: int("order").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ListItem = typeof listItems.$inferSelect;
export type InsertListItem = typeof listItems.$inferInsert;

/**
 * Notifications - reminders for rehearsals and services
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  listId: int("listId"),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  scheduledTime: timestamp("scheduledTime").notNull(),
  sent: boolean("sent").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;