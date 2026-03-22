import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  bookingsTable,
  packagesTable,
  vehiclesTable,
  provincesTable,
  citiesTable,
  insertBookingSchema,
} from "@workspace/db/schema";
import { eq, and, desc } from "drizzle-orm";

const router: IRouter = Router();

// Shared select shape that includes package + vehicle relations
const bookingSelect = {
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
};

type BookingRow = {
  id: number;
  type: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  packageId: number | null;
  vehicleId: number | null;
  startDate: string;
  endDate: string | null;
  participants: number | null;
  totalPrice: number;
  notes: string | null;
  createdAt: Date | string;
  package: {
    id: number | null;
    title: string | null;
    slug: string | null;
    description: string | null;
    price: number | null;
    duration: number | null;
    maxParticipants: number | null;
    imageUrl: string | null;
    images: string[] | null;
    includes: string[] | null;
    excludes: string[] | null;
    itinerary: string | null;
    provinceId: number | null;
    cityId: number | null;
    isFeatured: boolean | null;
    isActive: boolean | null;
    rating: number | null;
    totalReviews: number | null;
    createdAt: Date | string | null;
  } | null;
  vehicle: {
    id: number | null;
    name: string | null;
    type: string | null;
    brand: string | null;
    capacity: number | null;
    pricePerDay: number | null;
    imageUrl: string | null;
    images: string[] | null;
    features: string[] | null;
    isAvailable: boolean | null;
    description: string | null;
    createdAt: Date | string | null;
  } | null;
};

function serializeBooking(b: BookingRow) {
  return {
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
  };
}

router.get("/bookings", async (req, res) => {
  try {
    const { status, type } = req.query;
    const conditions: ReturnType<typeof eq>[] = [];
    if (status) conditions.push(eq(bookingsTable.status, status as string));
    if (type) conditions.push(eq(bookingsTable.type, type as string));

    const query = db
      .select(bookingSelect)
      .from(bookingsTable)
      .leftJoin(packagesTable, eq(bookingsTable.packageId, packagesTable.id))
      .leftJoin(vehiclesTable, eq(bookingsTable.vehicleId, vehiclesTable.id));

    const bookings = conditions.length > 0
      ? await query.where(and(...conditions)).orderBy(desc(bookingsTable.createdAt))
      : await query.orderBy(desc(bookingsTable.createdAt));

    res.json(bookings.map(serializeBooking));
  } catch (err) {
    req.log.error(err, "Failed to get bookings");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/bookings/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [booking] = await db
      .select(bookingSelect)
      .from(bookingsTable)
      .leftJoin(packagesTable, eq(bookingsTable.packageId, packagesTable.id))
      .leftJoin(vehiclesTable, eq(bookingsTable.vehicleId, vehiclesTable.id))
      .where(eq(bookingsTable.id, id));

    if (!booking) { res.status(404).json({ error: "Not found" }); return; }
    res.json(serializeBooking(booking as BookingRow));
  } catch (err) {
    req.log.error(err, "Failed to get booking");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/bookings", async (req, res) => {
  try {
    const data = insertBookingSchema.parse(req.body);
    const [booking] = await db.insert(bookingsTable).values(data).returning();
    res.status(201).json({ ...booking, createdAt: booking.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to create booking");
    res.status(400).json({ error: "Bad request" });
  }
});

router.put("/bookings/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      status,
      notes,
      customerName,
      customerEmail,
      customerPhone,
      startDate,
    } = req.body as Record<string, unknown>;

    const patch: Partial<typeof bookingsTable.$inferInsert> = {};
    if (typeof status === "string") patch.status = status;
    if (notes !== undefined) patch.notes = notes === null ? null : String(notes);
    if (typeof customerName === "string") patch.customerName = customerName;
    if (typeof customerEmail === "string") patch.customerEmail = customerEmail;
    if (customerPhone !== undefined) {
      patch.customerPhone = customerPhone === null || customerPhone === "" ? null : String(customerPhone);
    }
    if (typeof startDate === "string") patch.startDate = startDate;

    if (Object.keys(patch).length === 0) {
      res.status(400).json({ error: "Bad request", message: "No updatable fields" });
      return;
    }

    const [updated] = await db
      .update(bookingsTable)
      .set(patch)
      .where(eq(bookingsTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    // Return with relations
    const [booking] = await db
      .select(bookingSelect)
      .from(bookingsTable)
      .leftJoin(packagesTable, eq(bookingsTable.packageId, packagesTable.id))
      .leftJoin(vehiclesTable, eq(bookingsTable.vehicleId, vehiclesTable.id))
      .where(eq(bookingsTable.id, id));

    res.json(serializeBooking(booking as BookingRow));
  } catch (err) {
    req.log.error(err, "Failed to update booking");
    res.status(400).json({ error: "Bad request" });
  }
});

export default router;
