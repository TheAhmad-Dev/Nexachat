import type { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import User from "../utils/models/User.js";
import { buildAuthSession } from "../utils/token.js";
import { logger } from "../utils/logger.js";

/*
 * ============================================================
 * POST /auth/google
 * ============================================================
 *
 * Verifies a Google ID token issued to the mobile app by the
 * Google Sign-In SDK, then:
 *   - finds the matching user by email, or
 *   - creates one on first sign-in (random password — the user
 *     can never log in with it directly; they use Google)
 *
 * Either way the response is the SAME buildAuthSession shape
 * as /auth/login and /auth/register, so the app treats a
 * Google sign-in exactly like any other session.
 *
 * Client ID: the Google Cloud OAuth "Web application" client
 * ID. On Android the token's `azp` (authorized party) claim
 * holds the installed Android client ID — validating that azp
 * is one of ours keeps Android, iOS and web tokens all
 * verifiable with a single audience.
 *
 * Configure GOOGLE_CLIENT_ID / GOOGLE_ANDROID_CLIENT_ID in
 * .env to enable. Without them the endpoint is disabled and
 * returns 501, so the app must fall back to email login.
 * ============================================================
 */

const googleClient = new OAuth2Client();

const getAudiences = (): string[] =>
  [process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_ANDROID_CLIENT_ID]
    .map((id) => id?.trim())
    .filter((id): id is string => Boolean(id));

export const googleAuth = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { idToken } = request.body as { idToken?: unknown };

  if (typeof idToken !== "string" || !idToken) {
    response.status(400).json({
      success: false,
      msg: "Google ID token is required",
    });
    return;
  }

  const audiences = getAudiences();

  if (audiences.length === 0) {
    response.status(501).json({
      success: false,
      msg: "Google sign-in is not configured on the server",
    });
    return;
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: audiences,
    });

    const payload = ticket.getPayload();

    if (!payload?.email || !payload.email_verified) {
      response.status(401).json({
        success: false,
        msg: "Google account email is not verified",
      });
      return;
    }

    // azp (authorized party) must be one of our client IDs —
    // covers Android installed-app tokens whose aud is the web client.
    if (payload.azp && !audiences.includes(payload.azp)) {
      response.status(401).json({
        success: false,
        msg: "Google sign-in client is not recognized",
      });
      return;
    }

    const email = payload.email.toLowerCase();
    const name = payload.name || email.split("@")[0] || email;
    const avatar = payload.picture ?? "";

    let user = await User.findOne({ email });

    if (!user) {
      // New Google user: create the account with an unguessable
      // password so only Google can ever authenticate it.
      const randomPassword = bcrypt.genSaltSync(24);

      user = await User.create({
        email,
        name,
        avatar,
        password: randomPassword,
      });

      logger.info(`Created Google account for user: ${email}`);
    }

    response.status(200).json(buildAuthSession(user));
  } catch (error) {
    logger.error("Google auth failed:", error);

    response.status(401).json({
      success: false,
      msg: "Google sign-in could not be verified",
    });
  }
};
