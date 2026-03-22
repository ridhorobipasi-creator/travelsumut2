import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { galleryTable, insertGallerySchema } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/gallery", async (req, res) => {
  try {
    const { category } = req.query;
    const items = category
      ? await db.select().from(galleryTable).where(eq(galleryTable.category, category as string)).orderBy(galleryTable.createdAt)
      : await db.select().from(galleryTable).orderBy(galleryTable.createdAt);
    res.json(items.map(i => ({ ...i, createdAt: i.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err, "Failed to get gallery");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/gallery", async (req, res) => {
  try {
    const data = insertGallerySchema.parse(req.body);
    const [item] = await db.insert(galleryTable).values(data).returning();
    res.status(201).json({ ...item, createdAt: item.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to create gallery item");
    res.status(400).json({ error: "Bad request" });
  }
});

router.put("/gallery/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = insertGallerySchema.parse(req.body);
    const [item] = await db.update(galleryTable).set(data).where(eq(galleryTable.id, id)).returning();
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json({ ...item, createdAt: item.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to update gallery item");
    res.status(400).json({ error: "Bad request" });
  }
});

router.delete("/gallery/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(galleryTable).where(eq(galleryTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err, "Failed to delete gallery item");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
