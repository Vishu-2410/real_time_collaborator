import http from 'http';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { initSocket } from './socket/index.js';

const startServer = async () => {
  await connectDB();

  const app = createApp();
  const server = http.createServer(app);

  initSocket(server);

  server.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer();
