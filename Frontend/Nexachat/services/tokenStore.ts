import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import type { DecodedTokenProps } from "@/types";

/*
 * ============================================================
 * tokenStore — the SINGLE owner of token persistence
 * ============================================================
 *
 * Keys, reads, writes, and deletes for auth tokens live ONLY
 * here. AuthContext, the socket module, and auth services all
 * go through this module — nobody else touches AsyncStorage
 * for token keys, so the key names and the always-together
 * clear() policy can never drift.
 * ============================================================
 */

const ACCESS_KEY = "token";
const REFRESH_KEY = "refreshToken";

export const getAccessToken = (): Promise<string | null> =>
  AsyncStorage.getItem(ACCESS_KEY);

export const saveAccessToken = (token: string): Promise<void> =>
  AsyncStorage.setItem(ACCESS_KEY, token);

export const getRefreshToken = (): Promise<string | null> =>
  AsyncStorage.getItem(REFRESH_KEY);

export const saveRefreshToken = (token: string): Promise<void> =>
  AsyncStorage.setItem(REFRESH_KEY, token);

/** Persists an auth session (both tokens) from login/register/refresh. */
export const saveAuthSession = async (session: {
  token: string;
  refreshToken?: string;
}): Promise<void> => {
  await saveAccessToken(session.token);

  if (session.refreshToken) {
    await saveRefreshToken(session.refreshToken);
  }
};

/**
 * Clears both tokens together — they are a pair: keeping a
 * refresh token while dropping the access token (or vice
 * versa) leaves the app in a state that can neither connect
 * nor recover.
 */
export const clearTokens = async (): Promise<void> => {
  await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY]);
};

/** Decodes the access-token payload; throws on a malformed token. */
export const decodeAccessToken = (token: string): DecodedTokenProps =>
  jwtDecode<DecodedTokenProps>(token);

/** True when the access token's exp claim is in the past. */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeAccessToken(token);

    return Boolean(decoded.exp && decoded.exp < Date.now() / 1000);
  } catch {
    return true;
  }
};
