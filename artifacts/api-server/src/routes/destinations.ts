import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { destinationsTable, citiesTable, provincesTable, insertDestinationSchema } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/destinations", async (req, res) => {
  try {
    const cityId = req.query.cityId ? parseInt(req.query.cityId as string) : undefined;
    const query = db
      .select({
        id: destinationsTable.id,
        cityId: destinationsTable.cityId,
        name: destinationsTable.name,
        slug: destinationsTable.slug,
        description: destinationsTable.description,
        imageUrl: destinationsTable.imageUrl,
        rating: destinationsTable.rating,
        createdAt: destinationsTable.createdAt,
        city: {
          id: citiesTable.id,
          name: citiesTable.name,
          slug: citiesTable.slug,
          provinceId: citiesTable.provinceId,
          description: citiesTable.description,
          imageUrl: citiesTable.imageUrl,
          createdAt: citiesTable.createdAt,
        },
      })
      .from(destinationsTable)
      .leftJoin(citiesTable, eq(destinationsTable.cityId, citiesTable.id));

    const destinations = cityId
      ? await query.where(eq(destinationsTable.cityId, cityId))
      : await query;

    res.json(destinations.map(d => ({ ...d, createdAt: d.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err, "Failed to get destinations");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/destinations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [destination] = await db.select().from(destinationsTable).where(eq(destinationsTable.id, id));
    if (!destination) return res.status(404).json({ error: "Not found" });
    res.json({ ...destination, createdAt: destination.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to get destination");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/destinations", async (req, res) => {
  try {
    const data = insertDestinationSchema.parse(req.body);
    const [destination] = await db.insert(destinationsTable).values(data).returning();
    res.status(201).json({ ...destination, createdAt: destination.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to create destination");
    res.status(400).json({ error: "Bad request" });
  }
});

router.put("/destinations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = insertDestinationSchema.parse(req.body);
    const [destination] = await db.update(destinationsTable).set(data).where(eq(destinationsTable.id, id)).returning();
    if (!destination) return res.status(404).json({ error: "Not found" });
    res.json({ ...destination, createdAt: destination.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to update destination");
    res.status(400).json({ error: "Bad request" });
  }
});

router.delete("/destinations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(destinationsTable).where(eq(destinationsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err, "Failed to delete destination");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
