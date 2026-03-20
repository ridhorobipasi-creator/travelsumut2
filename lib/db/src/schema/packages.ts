import { pgTable, text, serial, integer, timestamp, real, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { provincesTable } from "./provinces";
import { citiesTable } from "./cities";

export const packagesTable = pgTable("packages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: real("price").notNull(),
  duration: integer("duration").notNull(),
  maxParticipants: integer("max_participants"),
  imageUrl: text("image_url"),
  images: jsonb("images").$type<string[]>().default([]).notNull(),
  includes: jsonb("includes").$type<string[]>().default([]).notNull(),
  excludes: jsonb("excludes").$type<string[]>().default([]).notNull(),
  itinerary: text("itinerary"),
  provinceId: integer("province_id").references(() => provincesTable.id, { onDelete: "set null" }),
  cityId: integer("city_id").references(() => citiesTable.id, { onDelete: "set null" }),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  rating: real("rating"),
  totalReviews: integer("total_reviews").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPackageSchema = createInsertSchema(packagesTable).omit({ id: true, createdAt: true, totalReviews: true });
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packagesTable.$inferSelect;
