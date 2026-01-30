import express, { Application, Request, Response} from 'express';
import cors from "cors";

const app: Application = express();
app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    credentials: true,
}))

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world');
});

export default app;  

