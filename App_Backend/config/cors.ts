import type { CorsOptions } from "cors";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

/*
 * ============================================================
 * CORS policy — single owner for HTTP and Socket.IO
 * ============================================================
 *
 * Native apps (Expo Go, APK) do NOT send an Origin header, so
 * they pass through unrestricted. Web browsers get only the
 * origins listed in ALLOWED_ORIGINS. With ALLOWED_ORIGINS unset
 * (local development) every web origin is accepted.
 * ============================================================
 */

const allowAll: CorsOptions = {};

const restricted: CorsOptions = {
  origin: (origin, callback) => {
    // No Origin header -> native app or server-to-server.
    if (!origin || env.allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    logger.warn(`CORS blocked origin: ${origin}`);
    callback(new Error("Not allowed by CORS"));
  },
};

export const corsOptions: CorsOptions =
  env.allowedOrigins.length === 0 ? allowAll : restricted;

/** Socket.IO uses the same origin list in its own options shape. */
export const socketCorsOrigin: string | string[] =
  env.allowedOrigins.length === 0 ? "*" : env.allowedOrigins;
