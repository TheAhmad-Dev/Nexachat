import type { Request, Response } from "express";
import User from "../utils/models/User.js";
import { buildAuthSession, verifyRefreshToken } from "../utils/token.js";
import { logger } from "../utils/logger.js";

/*
 * ============================================================
 * POST /auth/refresh
 * ============================================================
 *
 * Expects { refreshToken } in the body. Verifies it against
 * the refresh secret, loads the user fresh from MongoDB (so a
 * deleted user cannot mint new tokens and name/avatar changes
 * propagate), and returns a brand-new short-lived access token.
 *
 * The refresh token itself is NOT rotated on every call — it
 * stays valid for its full TTL. Rotation can be added later by
 * also returning a new refresh token here.
 * ============================================================
 */
export const refreshAccessToken = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { refreshToken } = request.body as { refreshToken?: unknown };

  if (typeof refreshToken !== "string" || !refreshToken) {
    response.status(400).json({
      success: false,
      msg: "Refresh token is required",
    });
    return;
  }

  const userId = verifyRefreshToken(refreshToken);

  if (!userId) {
    response.status(401).json({
      success: false,
      msg: "Invalid or expired refresh token",
    });
    return;
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      response.status(401).json({
        success: false,
        msg: "User no longer exists",
      });
      return;
    }

    response.status(200).json(buildAuthSession(user));
  } catch (error) {
    logger.error("Refresh token exchange failed:", error);

    response.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};
