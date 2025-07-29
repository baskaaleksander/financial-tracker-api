import express from 'express';
import { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('app is running!');
});

app.use(errorMiddleware);

export default app;
