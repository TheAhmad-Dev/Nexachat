import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import type { UserProps } from "../types.js";

type TokenUser = Pick<UserProps, "email" | "name" | "avatar"> & {
  id?: string;
  _id?: unknown;
};

/*
 * ============================================================
 * Token module — the SINGLE owner of JWT policy
 * ============================================================
 *
 * Everything about token shape, secrets, TTLs, and what
 * counts as a valid access credential lives here. Callers
 * (HTTP middleware, socket handshake, controllers) must not
 * call jwt.verify themselves.
 *
 *   - access token  -> short-lived (env.accessTokenTtl),
 *     payload { user: { id, email, name, avatar } }
 *   - refresh token -> long-lived (env.refreshTokenTtl),
 *     different secret, `typ: "refresh"` claim so the two
 *     can never be swapped
 *
 * The access payload shape is load-bearing: the frontend
 * decodes it with jwtDecode<DecodedTokenProps>.
 * ============================================================
 */

/** Narrow shape every access-token payload carries. */
export interface TokenPayload {
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string;
  };
}

/** Extra claims carried only by refresh tokens. */
export interface RefreshTokenClaims {
  typ: "refresh";
  userId: string;
}

const buildUserPayload = (user: TokenUser): TokenPayload["user"] => ({
  email: user.email,
  name: user.name,
  id: user.id ?? String(user._id),
  avatar: user.avatar ?? "",
});

/** Short-lived token sent with every request / socket handshake. */
export const generateToken = (user: TokenUser): string => {
  const options: SignOptions = {
    expiresIn: env.accessTokenTtl as NonNullable<SignOptions["expiresIn"]>,
  };

  return jwt.sign({ user: buildUserPayload(user) }, env.jwtSecret, options);
};

/** Long-lived token used only to mint new access tokens. */
export const generateRefreshToken = (user: TokenUser): string => {
  const options: SignOptions = {
    expiresIn: env.refreshTokenTtl as NonNullable<SignOptions["expiresIn"]>,
  };

  return jwt.sign(
    {
      typ: "refresh",
      userId: buildUserPayload(user).id,
    } satisfies RefreshTokenClaims,
    env.refreshTokenSecret,
    options
  );
};

/**
 * Verifies an ACCESS token and returns its user payload, or
 * null when the token is expired, malformed, signed with the
 * wrong secret, or is a refresh token. This one function is
 * the whole "what is a valid access credential" policy.
 */
export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as TokenPayload & {
      typ?: string;
    };

    if (decoded.typ === "refresh") {
      return null;
    }

    return decoded.user?.id ? decoded : null;
  } catch {
    return null;
  }
};

/** Verifies a refresh token and returns the owning user id, or null. */
export const verifyRefreshToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(
      token,
      env.refreshTokenSecret
    ) as RefreshTokenClaims;

    return decoded.typ === "refresh" ? decoded.userId : null;
  } catch {
    return null;
  }
};

/** The full auth payload every login/register/refresh endpoint returns. */
export const buildAuthSession = (user: TokenUser) => ({
  success: true as const,
  token: generateToken(user),
  refreshToken: generateRefreshToken(user),
  user: buildUserPayload(user),
});
