import type { Server as IOServer, Socket } from "socket.io";

let io: IOServer | null = null;

// Track connected users: userId -> Set of socket IDs
const connectedUsers = new Map<string, Set<string>>();

/**
 * Authenticate socket connection using better-auth session
 */
export const authenticateSocket = async (
  socket: Socket,
): Promise<string | null> => {
  try {
    // Get session from socket handshake headers or query
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      return null;
    }

    // In a real implementation, you would verify the token here
    // For now, we'll extract userId from the token or use a custom verification
    // This assumes the client sends userId as part of auth
    const userId =
      socket.handshake.auth.userId || socket.handshake.query.userId;

    return userId as string;
  } catch (err) {
    console.error("Socket authentication failed", err);
    return null;
  }
};

/**
 * Add user to connected users map and join their user room
 */
export const addConnectedUser = (userId: string, socketId: string) => {
  if (!connectedUsers.has(userId)) {
    connectedUsers.set(userId, new Set());
  }
  connectedUsers.get(userId)!.add(socketId);
};

/**
 * Remove user from connected users map
 */
export const removeConnectedUser = (userId: string, socketId: string) => {
  const userSockets = connectedUsers.get(userId);
  if (userSockets) {
    userSockets.delete(socketId);
    if (userSockets.size === 0) {
      connectedUsers.delete(userId);
    }
  }
};

/**
 * Get all socket IDs for a user
 */
export const getUserSockets = (userId: string): string[] => {
  const sockets = connectedUsers.get(userId);
  return sockets ? Array.from(sockets) : [];
};

/**
 * Emit event to a specific user (all their connected sockets)
 */
export const emitToUser = (userId: string, event: string, data: any) => {
  const sockets = getUserSockets(userId);
  const io_instance = getIO();
  if (io_instance) {
    sockets.forEach((socketId) => {
      io_instance.to(socketId).emit(event, data);
    });
  }
};

/**
 * Emit event to multiple users
 */
export const emitToUsers = (userIds: string[], event: string, data: any) => {
  userIds.forEach((userId) => emitToUser(userId, event, data));
};

export const setIO = (server: IOServer) => {
  io = server;
};

/**
 * Get connected users count
 */
export const getConnectedUsersCount = (): number => {
  return connectedUsers.size;
};

/**
 * Get connected users list
 */
export const getConnectedUsers = (): string[] => {
  return Array.from(connectedUsers.keys());
};

export const getIO = () => io;

export default getIO;
