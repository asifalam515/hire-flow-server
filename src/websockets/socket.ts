import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtPayload } from '../middlewares/auth.middleware';

export let io: Server;

export const initializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: env.CORS_ORIGINS.split(','),
      methods: ['GET', 'POST']
    }
  });

  // Authentication Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log(`🔌  Client connected: ${socket.id} (User: ${socket.data.user?.id})`);

    // Join personal user room for global notifications
    if (socket.data.user?.id) {
      socket.join(socket.data.user.id);
    }

    // Join a specific conversation room
    socket.on('join_room', (conversationId: string) => {
      socket.join(conversationId);
      console.log(`User ${socket.data.user?.id} joined room ${conversationId}`);
    });

    // Handle incoming messages
    socket.on('send_message', (data: { conversationId: string; message: any }) => {
      // The message is already saved via REST, but the client emits it here to broadcast,
      // OR we can rely solely on the REST endpoint to emit to the socket.
      // Usually, it's better to broadcast from the REST controller after saving to the DB.
      // We will allow direct broadcasting if needed, but the REST approach is safer for DB consistency.
      socket.to(data.conversationId).emit('receive_message', data.message);
    });

    socket.on('typing', (data: { conversationId: string; isTyping: boolean }) => {
      socket.to(data.conversationId).emit('typing', {
        userId: socket.data.user?.id,
        isTyping: data.isTyping
      });
    });

    // Collaborative Code Sandbox events for Interview Chambers
    socket.on('code_change', (data: { roomId: string; code: string; language?: string }) => {
      socket.to(data.roomId).emit('code_update', {
        code: data.code,
        language: data.language,
        senderId: socket.data.user?.id,
        timestamp: Date.now(),
      });
    });

    socket.on('code_language_change', (data: { roomId: string; language: string }) => {
      socket.to(data.roomId).emit('code_language_update', {
        language: data.language,
        senderId: socket.data.user?.id,
      });
    });

    socket.on('code_run_result', (data: { roomId: string; output: string; status: 'success' | 'error' }) => {
      socket.to(data.roomId).emit('code_run_broadcast', {
        output: data.output,
        status: data.status,
        senderId: socket.data.user?.id,
        timestamp: Date.now(),
      });
    });

    socket.on('leave_room', (roomId: string) => {
      socket.leave(roomId);
    });

    socket.on('disconnect', () => {
      console.log(`🔌  Client disconnected: ${socket.id}`);
    });
  });

  return io;
};
