import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

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
 * Expected header:
 *
 * Authorization: Bearer YOUR_JWT_TOKEN
 *
 * The JWT was created by your existing generateToken()
 * function.
 *
 * Its structure is:
 *
 * {
 *   user: {
 *     email,
 *     name,
 *     id,
 *     avatar
 *   }
 * }
 */
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    /*
     * Get the Authorization header.
     */
    const authHeader = req.headers.authorization;

    /*
     * Make sure the header exists and follows:
     *
     * Bearer TOKEN
     */
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        msg: "Authentication required",
      });

      return;
    }

    /*
     * Remove "Bearer " and keep only the JWT.
     */
    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        msg: "Invalid authentication token",
      });

      return;
    }

    /*
     * Verify the JWT using the SAME secret used by
     * generateToken().
     */
    const decoded = jwt.verify(token, env.jwtSecret) as {
      user?: {
        id?: string;
      };
    };

    /*
     * Our generateToken() creates:
     *
     * {
     *   user: {
     *     id: "..."
     *   }
     * }
     *
     * Therefore the logged-in user's ID is:
     *
     * decoded.user.id
     */
    const userId = decoded.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        msg: "Invalid authentication token",
      });

      return;
    }

    /*
     * Attach the authenticated user's ID to the request.
     *
     * Controllers can now use:
     *
     * request.userId
     */
    req.userId = userId;

    /*
     * Continue to the controller.
     */
    next();
  } catch (error) {
    console.log("Authentication failed:", error);

    res.status(401).json({
      success: false,
      msg: "Invalid or expired token",
    });
  }
};