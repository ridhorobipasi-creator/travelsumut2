import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { vehiclesTable, insertVehicleSchema } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/vehicles", async (req, res) => {
  try {
    const { type, available } = req.query;
    const conditions: ReturnType<typeof eq>[] = [];
    if (type) conditions.push(eq(vehiclesTable.type, type as string));
    if (available === "true") conditions.push(eq(vehiclesTable.isAvailable, true));
    if (available === "false") conditions.push(eq(vehiclesTable.isAvailable, false));

    const vehicles = conditions.length > 0
      ? await db.select().from(vehiclesTable).where(and(...conditions)).orderBy(vehiclesTable.name)
      : await db.select().from(vehiclesTable).orderBy(vehiclesTable.name);

    res.json(vehicles.map(v => ({ ...v, createdAt: v.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err, "Failed to get vehicles");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/vehicles/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [vehicle] = await db.select().from(vehiclesTable).where(eq(vehiclesTable.id, id));
    if (!vehicle) return res.status(404).json({ error: "Not found" });
    res.json({ ...vehicle, createdAt: vehicle.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to get vehicle");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/vehicles", async (req, res) => {
  try {
    const data = insertVehicleSchema.parse(req.body);
    const [vehicle] = await db.insert(vehiclesTable).values(data).returning();
    res.status(201).json({ ...vehicle, createdAt: vehicle.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to create vehicle");
    res.status(400).json({ error: "Bad request" });
  }
});

router.put("/vehicles/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = insertVehicleSchema.parse(req.body);
    const [vehicle] = await db.update(vehiclesTable).set(data).where(eq(vehiclesTable.id, id)).returning();
    if (!vehicle) return res.status(404).json({ error: "Not found" });
    res.json({ ...vehicle, createdAt: vehicle.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to update vehicle");
    res.status(400).json({ error: "Bad request" });
  }
});

router.delete("/vehicles/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(vehiclesTable).where(eq(vehiclesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err, "Failed to delete vehicle");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
