import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bannersTable, insertBannerSchema } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { asc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/banners", async (req, res) => {
  try {
    const { active } = req.query;
    const banners = active === "true"
      ? await db.select().from(bannersTable).where(eq(bannersTable.isActive, true)).orderBy(asc(bannersTable.order))
      : await db.select().from(bannersTable).orderBy(asc(bannersTable.order));
    res.json(banners.map(b => ({ ...b, createdAt: b.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err, "Failed to get banners");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/banners", async (req, res) => {
  try {
    const data = insertBannerSchema.parse(req.body);
    const [banner] = await db.insert(bannersTable).values(data).returning();
    res.status(201).json({ ...banner, createdAt: banner.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to create banner");
    res.status(400).json({ error: "Bad request" });
  }
});

router.put("/banners/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = insertBannerSchema.parse(req.body);
    const [banner] = await db.update(bannersTable).set(data).where(eq(bannersTable.id, id)).returning();
    if (!banner) return res.status(404).json({ error: "Not found" });
    res.json({ ...banner, createdAt: banner.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to update banner");
    res.status(400).json({ error: "Bad request" });
  }
});

router.delete("/banners/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(bannersTable).where(eq(bannersTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err, "Failed to delete banner");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
