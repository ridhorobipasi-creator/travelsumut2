import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { packagesTable, provincesTable, citiesTable, insertPackageSchema } from "@workspace/db/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/packages", async (req, res) => {
  try {
    const { provinceId, cityId, minPrice, maxPrice, duration, featured } = req.query;
    const conditions: ReturnType<typeof eq>[] = [];
    if (provinceId) conditions.push(eq(packagesTable.provinceId, parseInt(provinceId as string)));
    if (cityId) conditions.push(eq(packagesTable.cityId, parseInt(cityId as string)));
    if (minPrice) conditions.push(gte(packagesTable.price, parseFloat(minPrice as string)));
    if (maxPrice) conditions.push(lte(packagesTable.price, parseFloat(maxPrice as string)));
    if (duration) conditions.push(eq(packagesTable.duration, parseInt(duration as string)));
    if (featured === "true") conditions.push(eq(packagesTable.isFeatured, true));

    const query = db
      .select({
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
        province: {
          id: provincesTable.id,
          name: provincesTable.name,
          slug: provincesTable.slug,
          description: provincesTable.description,
          imageUrl: provincesTable.imageUrl,
          createdAt: provincesTable.createdAt,
        },
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
      .from(packagesTable)
      .leftJoin(provincesTable, eq(packagesTable.provinceId, provincesTable.id))
      .leftJoin(citiesTable, eq(packagesTable.cityId, citiesTable.id));

    const packages = conditions.length > 0
      ? await query.where(and(...conditions)).orderBy(packagesTable.createdAt)
      : await query.orderBy(packagesTable.createdAt);

    res.json(packages.map(p => ({ ...p, createdAt: p.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err, "Failed to get packages");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/packages/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const isNumeric = /^\d+$/.test(id);
    const condition = isNumeric
      ? eq(packagesTable.id, parseInt(id))
      : eq(packagesTable.slug, id);

    const [pkg] = await db
      .select({
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
        province: {
          id: provincesTable.id,
          name: provincesTable.name,
          slug: provincesTable.slug,
          description: provincesTable.description,
          imageUrl: provincesTable.imageUrl,
          createdAt: provincesTable.createdAt,
        },
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
      .from(packagesTable)
      .leftJoin(provincesTable, eq(packagesTable.provinceId, provincesTable.id))
      .leftJoin(citiesTable, eq(packagesTable.cityId, citiesTable.id))
      .where(condition);

    if (!pkg) return res.status(404).json({ error: "Not found" });
    res.json({ ...pkg, createdAt: pkg.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to get package");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/packages", async (req, res) => {
  try {
    const data = insertPackageSchema.parse(req.body);
    const [pkg] = await db.insert(packagesTable).values(data).returning();
    res.status(201).json({ ...pkg, createdAt: pkg.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to create package");
    res.status(400).json({ error: "Bad request" });
  }
});

router.put("/packages/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = insertPackageSchema.parse(req.body);
    const [pkg] = await db.update(packagesTable).set(data).where(eq(packagesTable.id, id)).returning();
    if (!pkg) return res.status(404).json({ error: "Not found" });
    res.json({ ...pkg, createdAt: pkg.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to update package");
    res.status(400).json({ error: "Bad request" });
  }
});

router.delete("/packages/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(packagesTable).where(eq(packagesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err, "Failed to delete package");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
