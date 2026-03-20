import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const provincesTable = pgTable("provinces", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProvinceSchema = createInsertSchema(provincesTable).omit({ id: true, createdAt: true });
export type InsertProvince = z.infer<typeof insertProvinceSchema>;
export type Province = typeof provincesTable.$inferSelect;
