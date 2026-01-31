import express, { Application, Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { notFound } from "./middlewares/notFound";
import { authRouter } from "./module/auth/auth.routes";

const app: Application = express();

app.use(cors({
  origin: process.env.APP_URL || "http://localhost:4000",
  credentials: true,
}));

app.use(express.json());

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use("/auth", authRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world');
});

app.use(notFound)

export default app;
