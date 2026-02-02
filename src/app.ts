import express, { Application, Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { authRouter } from "./module/auth/auth.routes";
import { providerRoutes } from "./module/providers/provider.routes";
import { auth } from "./lib/auth";
import { mealRoutes } from "./module/meals/meals.routes";
import { orderRoutes } from "./module/orders/order.routes";
import { reviewRoutes } from "./module/reviews/reviews.routes";
import { adminRoutes } from "./module/admin/admin.routes";
import { notFound } from "./middlewares/notFound";
import { categoryRoutes } from "./module/categories/category.routes";

const app: Application = express();

app.use(
  cors({
    // Allow the Next.js frontend origin in dev and prod.
    // Example:
    //   APP_URL=http://localhost:3000   (dev)
    //   APP_URL=https://foodhub-frontend.com (prod)
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// Expose Better Auth under /api/auth/* so the frontend can
// call /api/auth/* on its own origin (and proxy to this backend).
app.all("/api/auth/*", toNodeHandler(auth));

app.use("/auth", authRouter);
app.use("/providers", providerRoutes);
app.use("/meals", mealRoutes);
app.use("/orders", orderRoutes);
app.use("/reviews", reviewRoutes);
app.use("/admin", adminRoutes);
app.use("/categories", categoryRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

app.use(notFound);

export default app;
