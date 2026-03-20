import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { blogPostsTable, insertBlogPostSchema } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/blog", async (req, res) => {
  try {
    const { category, published } = req.query;
    const conditions: ReturnType<typeof eq>[] = [];
    if (category) conditions.push(eq(blogPostsTable.category, category as string));
    if (published === "true") conditions.push(eq(blogPostsTable.isPublished, true));
    if (published === "false") conditions.push(eq(blogPostsTable.isPublished, false));

    const posts = conditions.length > 0
      ? await db.select().from(blogPostsTable).where(and(...conditions)).orderBy(blogPostsTable.createdAt)
      : await db.select().from(blogPostsTable).orderBy(blogPostsTable.createdAt);

    res.json(posts.map(p => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      publishedAt: p.publishedAt?.toISOString() ?? null,
    })));
  } catch (err) {
    req.log.error(err, "Failed to get blog posts");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/blog/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const isNumeric = /^\d+$/.test(id);
    const condition = isNumeric
      ? eq(blogPostsTable.id, parseInt(id))
      : eq(blogPostsTable.slug, id);

    const [post] = await db.select().from(blogPostsTable).where(condition);
    if (!post) return res.status(404).json({ error: "Not found" });
    res.json({
      ...post,
      createdAt: post.createdAt.toISOString(),
      publishedAt: post.publishedAt?.toISOString() ?? null,
    });
  } catch (err) {
    req.log.error(err, "Failed to get blog post");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/blog", async (req, res) => {
  try {
    const data = insertBlogPostSchema.parse(req.body);
    const insertData = {
      ...data,
      publishedAt: data.isPublished ? new Date() : null,
    };
    const [post] = await db.insert(blogPostsTable).values(insertData).returning();
    res.status(201).json({
      ...post,
      createdAt: post.createdAt.toISOString(),
      publishedAt: post.publishedAt?.toISOString() ?? null,
    });
  } catch (err) {
    req.log.error(err, "Failed to create blog post");
    res.status(400).json({ error: "Bad request" });
  }
});

router.put("/blog/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = insertBlogPostSchema.parse(req.body);
    const [post] = await db.update(blogPostsTable).set(data).where(eq(blogPostsTable.id, id)).returning();
    if (!post) return res.status(404).json({ error: "Not found" });
    res.json({
      ...post,
      createdAt: post.createdAt.toISOString(),
      publishedAt: post.publishedAt?.toISOString() ?? null,
    });
  } catch (err) {
    req.log.error(err, "Failed to update blog post");
    res.status(400).json({ error: "Bad request" });
  }
});

router.delete("/blog/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err, "Failed to delete blog post");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
