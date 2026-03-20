import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { provincesTable, insertProvinceSchema } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/provinces", async (req, res) => {
  try {
    const provinces = await db.select().from(provincesTable).orderBy(provincesTable.name);
    res.json(provinces.map(p => ({ ...p, createdAt: p.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err, "Failed to get provinces");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/provinces/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [province] = await db.select().from(provincesTable).where(eq(provincesTable.id, id));
    if (!province) return res.status(404).json({ error: "Not found" });
    res.json({ ...province, createdAt: province.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to get province");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/provinces", async (req, res) => {
  try {
    const data = insertProvinceSchema.parse(req.body);
    const [province] = await db.insert(provincesTable).values(data).returning();
    res.status(201).json({ ...province, createdAt: province.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to create province");
    res.status(400).json({ error: "Bad request" });
  }
});

router.put("/provinces/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = insertProvinceSchema.parse(req.body);
    const [province] = await db.update(provincesTable).set(data).where(eq(provincesTable.id, id)).returning();
    if (!province) return res.status(404).json({ error: "Not found" });
    res.json({ ...province, createdAt: province.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to update province");
    res.status(400).json({ error: "Bad request" });
  }
});

router.delete("/provinces/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(provincesTable).where(eq(provincesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err, "Failed to delete province");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
