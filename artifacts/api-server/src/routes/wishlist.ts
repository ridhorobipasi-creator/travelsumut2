import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { wishlistsTable, insertWishlistSchema } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

// GET /api/wishlist?userId=1
router.get("/wishlist", async (req: Request, res: Response): Promise<void> => {
  try {
    const rawUserId = Array.isArray(req.query.userId) ? req.query.userId[0] : req.query.userId;
    const userId = rawUserId ? parseInt(rawUserId as string) : undefined;
    if (!userId) {
      res.status(400).json({ error: "userId query param required" });
      return;
    }

    const items = await db
      .select()
      .from(wishlistsTable)
      .where(eq(wishlistsTable.userId, userId))
      .orderBy(wishlistsTable.createdAt);

    res.json(items.map(i => ({ ...i, createdAt: i.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err, "Failed to get wishlist");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/wishlist
router.post("/wishlist", async (req: Request, res: Response): Promise<void> => {
  try {
    const data = insertWishlistSchema.parse(req.body);

    const existing = await db
      .select()
      .from(wishlistsTable)
      .where(and(eq(wishlistsTable.userId, data.userId), eq(wishlistsTable.packageId, data.packageId)));

    if (existing.length > 0) {
      res.status(409).json({ error: "Already in wishlist" });
      return;
    }

    const [item] = await db.insert(wishlistsTable).values(data).returning();
    res.status(201).json({ ...item, createdAt: item.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to add to wishlist");
    res.status(400).json({ error: "Bad request" });
  }
});

// DELETE /api/wishlist/:id
router.delete("/wishlist/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(String(req.params["id"]));
    const rawUserId = Array.isArray(req.query.userId) ? req.query.userId[0] : req.query.userId;
    const userId = rawUserId ? parseInt(rawUserId as string) : undefined;
    if (!userId) {
      res.status(400).json({ error: "userId query param required" });
      return;
    }

    const [deleted] = await db
      .delete(wishlistsTable)
      .where(and(eq(wishlistsTable.id, id), eq(wishlistsTable.userId, userId)))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    req.log.error(err, "Failed to delete wishlist item");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
