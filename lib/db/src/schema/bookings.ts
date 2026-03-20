import { pgTable, text, serial, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { packagesTable } from "./packages";
import { vehiclesTable } from "./vehicles";

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'package' | 'rental'
  status: text("status").default("pending").notNull(), // 'pending' | 'confirmed' | 'cancelled' | 'completed'
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  packageId: integer("package_id").references(() => packagesTable.id, { onDelete: "set null" }),
  vehicleId: integer("vehicle_id").references(() => vehiclesTable.id, { onDelete: "set null" }),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  participants: integer("participants"),
  totalPrice: real("total_price").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true, status: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
