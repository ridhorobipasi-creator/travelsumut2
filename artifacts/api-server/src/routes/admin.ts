import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  bookingsTable,
  packagesTable,
  vehiclesTable,
  customTripsTable,
  destinationsTable,
  testimonialsTable,
  insertCustomTripSchema,
} from "@workspace/db/schema";
import { eq, count, sum, desc } from "drizzle-orm";

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
    const [totalDestinationsResult] = await db.select({ count: count() }).from(destinationsTable);
    const [pendingTestimonialsResult] = await db
      .select({ count: count() })
      .from(testimonialsTable)
      .where(eq(testimonialsTable.isApproved, false));

    const recentBookings = await db
      .select({
        id: bookingsTable.id,
        type: bookingsTable.type,
        status: bookingsTable.status,
        customerName: bookingsTable.customerName,
        customerEmail: bookingsTable.customerEmail,
        customerPhone: bookingsTable.customerPhone,
        packageId: bookingsTable.packageId,
        vehicleId: bookingsTable.vehicleId,
        startDate: bookingsTable.startDate,
        endDate: bookingsTable.endDate,
        participants: bookingsTable.participants,
        totalPrice: bookingsTable.totalPrice,
        notes: bookingsTable.notes,
        createdAt: bookingsTable.createdAt,
        package: {
          id: packagesTable.id,
          title: packagesTable.title,
          slug: packagesTable.slug,
          description: packagesTable.description,
          price: packagesTable.price,
          duration: packagesTable.duration,
          maxParticipants: packagesTable.maxParticipants,
          imageUrl: packagesTable.imageUrl,
          images: packagesTable.images,
          includes: packagesTable.includes,
          excludes: packagesTable.excludes,
          itinerary: packagesTable.itinerary,
          provinceId: packagesTable.provinceId,
          cityId: packagesTable.cityId,
          isFeatured: packagesTable.isFeatured,
          isActive: packagesTable.isActive,
          rating: packagesTable.rating,
          totalReviews: packagesTable.totalReviews,
          createdAt: packagesTable.createdAt,
        },
        vehicle: {
          id: vehiclesTable.id,
          name: vehiclesTable.name,
          type: vehiclesTable.type,
          brand: vehiclesTable.brand,
          capacity: vehiclesTable.capacity,
          pricePerDay: vehiclesTable.pricePerDay,
          imageUrl: vehiclesTable.imageUrl,
          images: vehiclesTable.images,
          features: vehiclesTable.features,
          isAvailable: vehiclesTable.isAvailable,
          description: vehiclesTable.description,
          createdAt: vehiclesTable.createdAt,
        },
      })
      .from(bookingsTable)
      .leftJoin(packagesTable, eq(bookingsTable.packageId, packagesTable.id))
      .leftJoin(vehiclesTable, eq(bookingsTable.vehicleId, vehiclesTable.id))
      .orderBy(desc(bookingsTable.createdAt))
      .limit(5);

    res.json({
      totalBookings: totalBookingsResult?.count ?? 0,
      activeBookings: activeBookingsResult?.count ?? 0,
      totalRevenue: Number(revenueResult?.total) || 0,
      totalPackages: totalPackagesResult?.count ?? 0,
      totalVehicles: totalVehiclesResult?.count ?? 0,
      totalCustomTrips: totalCustomTripsResult?.count ?? 0,
      totalDestinations: totalDestinationsResult?.count ?? 0,
      pendingTestimonials: pendingTestimonialsResult?.count ?? 0,
      recentBookings: recentBookings.map(b => ({
        ...b,
        createdAt: b.createdAt instanceof Date ? b.createdAt.toISOString() : b.createdAt,
        package: b.package?.id ? {
          ...b.package,
          createdAt: b.package.createdAt instanceof Date ? b.package.createdAt.toISOString() : b.package.createdAt,
        } : null,
        vehicle: b.vehicle?.id ? {
          ...b.vehicle,
          createdAt: b.vehicle.createdAt instanceof Date ? b.vehicle.createdAt.toISOString() : b.vehicle.createdAt,
        } : null,
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
