import express from 'express';
import { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middlewares/error.middleware';
import routes from './routes/index';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerJsDoc from 'swagger-jsdoc';
import { swaggerOptions } from './utils/swagger-options';

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.send('app is running!');
});

const swaggerDocs = swaggerJsDoc.default(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(errorMiddleware);
export default app;
