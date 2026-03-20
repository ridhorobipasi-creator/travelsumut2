import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  bookingsTable,
  packagesTable,
  vehiclesTable,
  customTripsTable,
  insertCustomTripSchema,
} from "@workspace/db/schema";
import { eq, count, sum } from "drizzle-orm";

const router: IRouter = Router();

router.get("/admin/stats", async (req, res) => {
  try {
    const [totalBookingsResult] = await db.select({ count: count() }).from(bookingsTable);
    const [activeBookingsResult] = await db
      .select({ count: count() })
      .from(bookingsTable)
      .where(eq(bookingsTable.status, "confirmed"));
    const [revenueResult] = await db.select({ total: sum(bookingsTable.totalPrice) }).from(bookingsTable);
    const [totalPackagesResult] = await db.select({ count: count() }).from(packagesTable);
    const [totalVehiclesResult] = await db.select({ count: count() }).from(vehiclesTable);
    const [totalCustomTripsResult] = await db.select({ count: count() }).from(customTripsTable);

    const recentBookings = await db
      .select()
      .from(bookingsTable)
      .orderBy(bookingsTable.createdAt)
      .limit(5);

    res.json({
      totalBookings: totalBookingsResult?.count ?? 0,
      activeBookings: activeBookingsResult?.count ?? 0,
      totalRevenue: revenueResult?.total ?? 0,
      totalPackages: totalPackagesResult?.count ?? 0,
      totalVehicles: totalVehiclesResult?.count ?? 0,
      totalCustomTrips: totalCustomTripsResult?.count ?? 0,
      recentBookings: recentBookings.map(b => ({
        ...b,
        createdAt: b.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    req.log.error(err, "Failed to get admin stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/custom-trips", async (req, res) => {
  try {
    const trips = await db.select().from(customTripsTable).orderBy(customTripsTable.createdAt);
    res.json(trips.map(t => ({ ...t, createdAt: t.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err, "Failed to get custom trips");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/custom-trips", async (req, res) => {
  try {
    const data = insertCustomTripSchema.parse(req.body);
    const [trip] = await db.insert(customTripsTable).values(data).returning();
    res.status(201).json({ ...trip, createdAt: trip.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to create custom trip");
    res.status(400).json({ error: "Bad request" });
  }
});

router.put("/admin/custom-trips/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const [trip] = await db
      .update(customTripsTable)
      .set({ status })
      .where(eq(customTripsTable.id, id))
      .returning();
    if (!trip) return res.status(404).json({ error: "Not found" });
    res.json({ ...trip, createdAt: trip.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to update custom trip");
    res.status(400).json({ error: "Bad request" });
  }
});

export default router;
