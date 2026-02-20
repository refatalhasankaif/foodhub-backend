import express, { Application, Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

// your other route imports...
import { authRouter } from "./module/auth/auth.routes";
import { providerRoutes } from "./module/providers/provider.routes";
import { mealRoutes } from "./module/meals/meals.routes";
import { orderRoutes } from "./module/orders/order.routes";
import { reviewRoutes } from "./module/reviews/reviews.routes";
import { adminRoutes } from "./module/admin/admin.routes";
import { categoryRoutes } from "./module/categories/category.routes";
import { notFound } from "./middlewares/notFound";

const app: Application = express();

// In your main app file (before any routes)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        // Allow Postman, curl, server-side requests
        return callback(null, true);
      }

      // Your allowed list
      const allowed = [
        "http://localhost:3000",
        "https://your-foodhub-frontend.vercel.app", // ← add this
        // Add preview branches if needed
      ];

      if (allowed.includes(origin)) {
        callback(null, origin); // reflect the origin
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
    maxAge: 86400, // Cache preflight for 24h
  })
);

// Explicit OPTIONS handler (sometimes needed on Render)
app.options("*", cors(), (req, res) => {
  res.sendStatus(204);
});

app.use(express.json());

app.all("/api/auth/*path", toNodeHandler(auth));

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