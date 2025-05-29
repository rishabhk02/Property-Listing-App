import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDatabase } from './config/database';
import { redisConnection } from './config/redis';
import { config } from './config/environment';
import mainRouter from './mainRouter';

const app = express();

const startServer = async () => {
  await connectDatabase();
  await redisConnection.connect();

  // Middleware (these are fine to register here)
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Register routes ONLY after Redis is connected
  app.use('/api', mainRouter);

  // Health-check
  app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is healthy' });
  });

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
};

startServer();
