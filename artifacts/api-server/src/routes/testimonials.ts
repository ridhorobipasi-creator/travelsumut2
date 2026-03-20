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
    const [testimonial] = await db.insert(testimonialsTable).values(data).returning();
    res.status(201).json({ ...testimonial, createdAt: testimonial.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err, "Failed to create testimonial");
    res.status(400).json({ error: "Bad request" });
  }
});

router.put("/testimonials/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { isApproved, comment } = req.body;
    const [testimonial] = await db
      .update(testimonialsTable)
      .set({ isApproved, ...(comment !== undefined ? { comment } : {}) })
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
