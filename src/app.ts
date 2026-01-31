import express, { Application, Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { notFound } from "./middlewares/notFound";
import { authRouter } from "./module/auth/auth.routes";
import { providerRoutes } from "./module/providers/provider.routes";
import { mealRoutes } from "./module/meals/meals.routes";
import { adminRoutes } from "./module/admin/admin.routes";
import { orderRoutes } from "./module/orders/order.routes";
import { reviewRoutes } from "./module/reviews/reviews.routes";

const app: Application = express();

app.use(cors(
//     {
//   origin: process.env.APP_URL || "http://localhost:4000",
//   credentials: true,
// }
));

app.use(express.json());

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use("/auth", authRouter)
app.use("/providers", providerRoutes)
app.use("/meals", mealRoutes)
app.use("/orders", orderRoutes)
app.use("/reviews", reviewRoutes)
app.use("/admin", adminRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world');
});

app.use(notFound)

export default app;
