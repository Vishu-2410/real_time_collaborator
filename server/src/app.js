import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { notFoundMiddleware } from './middleware/notFoundMiddleware.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

export const createApp = () => {
  const app = express();

  app.use(express.json());

  app.use(
    cors({
      origin: env.clientOrigin,
      credentials: true
    })
  );

  app.get('/', (req, res) => {
    res.send('Real-time Collaborative Editor API');
  });

  app.use('/api', apiRoutes);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};
