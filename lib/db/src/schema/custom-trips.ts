import { pgTable, text, serial, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const customTripsTable = pgTable("custom_trips", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  destination: text("destination").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  participants: integer("participants").notNull(),
  budget: real("budget"),
  requirements: text("requirements"),
  status: text("status").default("pending").notNull(), // 'pending' | 'in_review' | 'quoted' | 'confirmed' | 'rejected'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCustomTripSchema = createInsertSchema(customTripsTable).omit({ id: true, createdAt: true, status: true });
export type InsertCustomTrip = z.infer<typeof insertCustomTripSchema>;
export type CustomTrip = typeof customTripsTable.$inferSelect;
