import { io } from 'socket.io-client';
import { env } from '../config/env.js';

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(env.socketUrl, {
      autoConnect: false
    });
  }
  return socket;
};
