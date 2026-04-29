import type { Server as IOServer, Socket } from "socket.io";
/**
 * Authenticate socket connection using better-auth session
 */
export declare const authenticateSocket: (socket: Socket) => Promise<string | null>;
/**
 * Add user to connected users map and join their user room
 */
export declare const addConnectedUser: (userId: string, socketId: string) => void;
/**
 * Remove user from connected users map
 */
export declare const removeConnectedUser: (userId: string, socketId: string) => void;
/**
 * Get all socket IDs for a user
 */
export declare const getUserSockets: (userId: string) => string[];
/**
 * Emit event to a specific user (all their connected sockets)
 */
export declare const emitToUser: (userId: string, event: string, data: any) => void;
/**
 * Emit event to multiple users
 */
export declare const emitToUsers: (userIds: string[], event: string, data: any) => void;
export declare const setIO: (server: IOServer) => void;
/**
 * Get connected users count
 */
export declare const getConnectedUsersCount: () => number;
/**
 * Get connected users list
 */
export declare const getConnectedUsers: () => string[];
export declare const getIO: () => IOServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any> | null;
export default getIO;
//# sourceMappingURL=socket.d.ts.map