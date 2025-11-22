import { Server as SocketIOServer } from 'socket.io';
import { env } from '../config/env.js';
import { registerDocumentSocketHandlers } from './documentSocket.js';

export const initSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: env.clientOrigin,
      methods: ['GET', 'POST']
    }
  });

  registerDocumentSocketHandlers(io);

  return io;
};
