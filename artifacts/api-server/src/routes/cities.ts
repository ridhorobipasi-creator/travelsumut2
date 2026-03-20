import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { citiesTable, provincesTable, insertCitySchema } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/cities", async (req, res) => {
  try {
    const provinceId = req.query.provinceId ? parseInt(req.query.provinceId as string) : undefined;
    const query = db
      .select({
        id: citiesTable.id,
        provinceId: citiesTable.provinceId,
        name: citiesTable.name,
        slug: citiesTable.slug,
        description: citiesTable.description,
        imageUrl: citiesTable.imageUrl,
        createdAt: citiesTable.createdAt,
        province: {
          id: provincesTable.id,
          name: provincesTable.name,
          slug: provincesTable.slug,
          description: provincesTable.description,
          imageUrl: provincesTable.imageUrl,
          createdAt: provincesTable.createdAt,
        },
      })
      .from(citiesTable)
      .leftJoin(provincesTable, eq(citiesTable.provinceId, provincesTable.id));

    const cities = provinceId
      ? await query.where(eq(citiesTable.provinceId, provinceId)).orderBy(citiesTable.name)
      : await query.orderBy(citiesTable.name);

    res.json(cities.map(c => ({ ...c, createdAt: c.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err, "Failed to get cities");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/cities", async (req, res) => {
  try {
    const data = insertCitySchema.parse(req.body);
    const [city] = await db.insert(citiesTable).values(data).returning();
    res.status(201).json({ ...city, createdAt: city.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to create city");
    res.status(400).json({ error: "Bad request" });
  }
});

router.put("/cities/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = insertCitySchema.parse(req.body);
    const [city] = await db.update(citiesTable).set(data).where(eq(citiesTable.id, id)).returning();
    if (!city) return res.status(404).json({ error: "Not found" });
    res.json({ ...city, createdAt: city.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to update city");
    res.status(400).json({ error: "Bad request" });
  }
});

router.delete("/cities/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(citiesTable).where(eq(citiesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err, "Failed to delete city");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
