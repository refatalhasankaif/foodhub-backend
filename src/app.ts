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

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://foodhub-backend-3poi.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

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