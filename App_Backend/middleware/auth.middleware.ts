import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token.js";
import { logger } from "../utils/logger.js";

/*
 * ---------------------------------------------------------
 * AUTHENTICATED REQUEST
 * ---------------------------------------------------------
 *
 * Express's normal Request type doesn't know about our
 * authenticated user.
 *
 * We add userId so controllers can safely access:
 *
 * request.userId
 */
export interface AuthenticatedRequest extends Request {
  userId?: string;
}

/*
 * ---------------------------------------------------------
 * AUTHENTICATION MIDDLEWARE
 * ---------------------------------------------------------
 *
 * Expected header: "Authorization: Bearer <accessToken>".
 *
 * All verification policy (secret, TTL, refresh-token
 * rejection) lives in utils/token.ts — this middleware only
 * extracts the header and maps the result to a 401.
 */
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      msg: "Authentication required",
    });

    return;
  }

  const token = authHeader.slice("Bearer ".length);

  // Single verification policy, shared with the socket handshake.
  const payload = verifyAccessToken(token);

  if (!payload) {
    logger.debug("Authentication failed: invalid or expired token");

    res.status(401).json({
      success: false,
      msg: "Invalid or expired token",
    });

    return;
  }

  req.userId = payload.user.id;

  next();
};