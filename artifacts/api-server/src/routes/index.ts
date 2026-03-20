import { type Express } from "express";
import healthRouter from "./health";
import provincesRouter from "./provinces";
import citiesRouter from "./cities";
import destinationsRouter from "./destinations";
import packagesRouter from "./packages";
import vehiclesRouter from "./vehicles";
import bookingsRouter from "./bookings";
import galleryRouter from "./gallery";
import blogRouter from "./blog";
import testimonialsRouter from "./testimonials";
import bannersRouter from "./banners";
import adminRouter from "./admin";

export function registerRoutes(app: Express): void {
  app.use("/api", healthRouter);
  app.use("/api", provincesRouter);
  app.use("/api", citiesRouter);
  app.use("/api", destinationsRouter);
  app.use("/api", packagesRouter);
  app.use("/api", vehiclesRouter);
  app.use("/api", bookingsRouter);
  app.use("/api", galleryRouter);
  app.use("/api", blogRouter);
  app.use("/api", testimonialsRouter);
  app.use("/api", bannersRouter);
  app.use("/api", adminRouter);
}
