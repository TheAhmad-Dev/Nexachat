import { Server as SocketIOServer, Socket } from "socket.io";
import type { Server as HttpServer } from "node:http";
import jwt from "jsonwebtoken";

// import Conversation from "../models/coversationSchema.js";
import Conversation from "../utils/models/coversationSchema.js";
import { env } from "../config/env.js";
import { RegisterUserEvents } from "./UserEvents.js";
import { RegisterChatEvents } from "./newchatEvents.js";

interface JwtUser {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
}

interface JwtPayload {
  user?: JwtUser;
}

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
    cors: {
      origin: "*",
    },
  });

  // Authenticate socket connection
  ioServer.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token;

    if (typeof token !== "string" || !token) {
      return next(
        new Error("Authentication Error: No token provided")
      );
    }

    try {
      const decoded = jwt.verify(
        token,
        env.jwtSecret
      ) as JwtPayload;

      const user = decoded.user;

      if (!user?.id) {
        return next(
          new Error("Authentication Error: Invalid Token")
        );
      }

      socket.data.userId = user.id;
      socket.data.name = user.name;
      socket.data.email = user.email;
      socket.data.avatar = user.avatar;

      next();
    } catch (error) {
      console.log("Socket authentication failed:", error);

      next(
        new Error("Authentication Error: Invalid or expired token")
      );
    }
  });

  // Socket Connected
  ioServer.on(
    "connection",
    async (socket: AuthenticatedSocket) => {
      const userId = socket.data.userId;

      console.log(
        `User Connected ✅ : ${userId}, Username: ${socket.data.name}`
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

        console.log(
          `Joined ${conversations.length} conversation(s)`
        );
      } catch (error) {
        console.log(
          "Error joining conversations:",
          error
        );
      }

      // Disconnect
      socket.on("disconnect", () => {
        console.log(
          `User Disconnected: ${userId}`
        );
      });
    }
  );

  return ioServer;
}