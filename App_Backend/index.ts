import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import http from "node:http";

import myconnectedDatabase from "./config/db.js";
import { env } from "./config/env.js";
import { corsOptions } from "./config/cors.js";
import { logger } from "./utils/logger.js";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

import { InitializeTheSocekt } from "./socket/socket.js";

const myapp = express();
const PORT = env.port;

// ==========================================
// SECURITY MIDDLEWARE
// ==========================================

// Security HTTP headers
myapp.use(helmet());

// Prevent excessively large JSON requests
myapp.use(express.json({ limit: "1mb" }));

// CORS policy lives in config/cors.ts (shared with Socket.IO).
myapp.use(cors(corsOptions));

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    msg: "Too many requests. Please try again later.",
  },
});

myapp.use(apiLimiter);

// ==========================================
// REQUEST LOGGER
// ==========================================

myapp.use((req, _res, next) => {
  logger.debug(`${req.method} ${req.url}`);
  next();
});

// ==========================================
// ROUTES
// ==========================================

myapp.use("/auth", authRoutes);
myapp.use("/api/messages", messageRoutes);
myapp.use("/api/notifications", notificationRoutes);

// ==========================================
// HEALTH CHECK
// ==========================================

myapp.get("/", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "NexaChat API is running",
  });
});

myapp.get("/health", (_request, response) => {
  response.status(200).json({
    success: true,
    status: "healthy",
  });
});

// ==========================================
// HTTP + SOCKET.IO SERVER
// ==========================================

const myserver = http.createServer(myapp);

InitializeTheSocekt(myserver);

// ==========================================
// DATABASE + SERVER START
// ==========================================

try {
  await myconnectedDatabase();

  myserver.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server is running on port ${PORT} (${env.nodeEnv})`);
  });
} catch (error) {
  logger.error("Application startup failed:", error);
  process.exit(1);
}