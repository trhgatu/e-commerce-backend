import { Server } from 'socket.io';
import http from 'http';
import { registerNotificationHandler } from './notification.handler';

let io: Server;

export const initSocketServer = (server: http.Server) => {
  io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId as string;
    if (userId) {
      socket.join(userId);
      console.log(`🔌 Socket connected: ${userId}`);
    }

    // future: socket.use(authSocketMiddleware);

    registerNotificationHandler();
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};
