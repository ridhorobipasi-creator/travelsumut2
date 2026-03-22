import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { testimonialsTable, insertTestimonialSchema } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/testimonials", async (req, res) => {
  try {
    const { approved } = req.query;
    const testimonials = approved === "true"
      ? await db.select().from(testimonialsTable).where(eq(testimonialsTable.isApproved, true)).orderBy(testimonialsTable.createdAt)
      : await db.select().from(testimonialsTable).orderBy(testimonialsTable.createdAt);
    res.json(testimonials.map(t => ({ ...t, createdAt: t.createdAt.toISOString() })));
  } catch (err) {
    req.log.error(err, "Failed to get testimonials");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/testimonials", async (req, res) => {
  try {
    const data = insertTestimonialSchema.parse(req.body);
    const isApproved =
      typeof (req.body as { isApproved?: boolean })?.isApproved === "boolean"
        ? (req.body as { isApproved: boolean }).isApproved
        : false;
    const [testimonial] = await db
      .insert(testimonialsTable)
      .values({ ...data, isApproved })
      .returning();
    res.status(201).json({ ...testimonial, createdAt: testimonial.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to create testimonial");
    res.status(400).json({ error: "Bad request" });
  }
});

router.put("/testimonials/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const b = req.body as Record<string, unknown>;
    const patch: Record<string, unknown> = {};
    if (typeof b.customerName === "string") patch.customerName = b.customerName;
    if (b.customerAvatar !== undefined) patch.customerAvatar = b.customerAvatar;
    if (typeof b.rating === "number") patch.rating = b.rating;
    if (typeof b.comment === "string") patch.comment = b.comment;
    if (b.packageId !== undefined) patch.packageId = b.packageId === null ? null : Number(b.packageId);
    if (typeof b.isApproved === "boolean") patch.isApproved = b.isApproved;

    if (Object.keys(patch).length === 0) {
      return res.status(400).json({ error: "Bad request", message: "No fields to update" });
    }

    const [testimonial] = await db
      .update(testimonialsTable)
      .set(patch as typeof testimonialsTable.$inferInsert)
      .where(eq(testimonialsTable.id, id))
      .returning();
    if (!testimonial) return res.status(404).json({ error: "Not found" });
    res.json({ ...testimonial, createdAt: testimonial.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to update testimonial");
    res.status(400).json({ error: "Bad request" });
  }
});

router.delete("/testimonials/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(testimonialsTable).where(eq(testimonialsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err, "Failed to delete testimonial");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
