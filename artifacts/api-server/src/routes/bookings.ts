import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bookingsTable, packagesTable, vehiclesTable, insertBookingSchema } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/bookings", async (req, res) => {
  try {
    const { status, type } = req.query;
    const conditions: ReturnType<typeof eq>[] = [];
    if (status) conditions.push(eq(bookingsTable.status, status as string));
    if (type) conditions.push(eq(bookingsTable.type, type as string));

    const bookings = conditions.length > 0
      ? await db.select().from(bookingsTable).where(and(...conditions)).orderBy(bookingsTable.createdAt)
      : await db.select().from(bookingsTable).orderBy(bookingsTable.createdAt);

    res.json(bookings.map(b => ({ ...b, createdAt: b.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err, "Failed to get bookings");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/bookings/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id));
    if (!booking) return res.status(404).json({ error: "Not found" });
    res.json({ ...booking, createdAt: booking.createdAt.toISOString() });
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
    const { status, notes } = req.body;
    const [booking] = await db
      .update(bookingsTable)
      .set({ status, notes })
      .where(eq(bookingsTable.id, id))
      .returning();
    if (!booking) return res.status(404).json({ error: "Not found" });
    res.json({ ...booking, createdAt: booking.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to update booking");
    res.status(400).json({ error: "Bad request" });
  }
});

export default router;
