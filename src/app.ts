import express from 'express';
import { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middlewares/error.middleware';
import routes from './routes/index';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.send('app is running!');
});

app.use(errorMiddleware);

export default app;
