import { Server as SocketIOServer, Socket } from "socket.io";
import type { Server as HttpServer } from "node:http";

// import Conversation from "../models/coversationSchema.js";
import Conversation from "../utils/models/coversationSchema.js";
import { env } from "../config/env.js";
import { socketCorsOrigin } from "../config/cors.js";
import { logger } from "../utils/logger.js";
import { verifyAccessToken } from "../utils/token.js";
import { RegisterUserEvents } from "./UserEvents.js";
import { RegisterChatEvents } from "./newchatEvents.js";

interface AuthenticatedSocket extends Socket {
  data: {
    userId: string;
    name?: string;
    email?: string;
    avatar?: string;
  };
}

export function InitializeTheSocekt(
  server: HttpServer
): SocketIOServer {
  const ioServer = new SocketIOServer(server, {
    cors: { origin: socketCorsOrigin },
  });

  // Authenticate socket connection.
  // Verification policy is the same single source the HTTP
  // middleware uses (utils/token.ts) — secret, TTL, and
  // refresh-token rejection can never drift between the two.
  ioServer.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token;

    if (typeof token !== "string" || !token) {
      return next(
        new Error("Authentication Error: No token provided")
      );
    }

    const payload = verifyAccessToken(token);

    if (!payload) {
      return next(
        new Error("Authentication Error: Invalid or expired token")
      );
    }

    socket.data.userId = payload.user.id;
    socket.data.name = payload.user.name;
    socket.data.email = payload.user.email;
    socket.data.avatar = payload.user.avatar;

    next();
  });

  // Socket Connected
  ioServer.on(
    "connection",
    async (socket: AuthenticatedSocket) => {
      const userId = socket.data.userId;

      logger.debug(
        `User Connected: ${userId}, Username: ${socket.data.name}`
      );

      // Register Events
      RegisterUserEvents(ioServer, socket);
      RegisterChatEvents(ioServer, socket);

      // Join all conversations of the user
      try {
        const conversations = await Conversation.find({
          participants: userId,
        }).select("_id");

        conversations.forEach((conversation) => {
          socket.join(String(conversation._id));
        });

        logger.debug(
          `Joined ${conversations.length} conversation(s)`
        );
      } catch (error) {
        logger.error("Error joining conversations:", error);
      }

      // Disconnect
      socket.on("disconnect", () => {
        logger.debug(`User Disconnected: ${userId}`);
      });
    }
  );

  return ioServer;
}