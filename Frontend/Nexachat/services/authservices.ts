import axios, { AxiosError } from "axios";
import { API_URL } from "../constants/index";
import { getRefreshToken } from "./tokenStore";

/*
 * ============================================================
 * authservices — pure backend API calls for auth
 * ============================================================
 *
 * No persistence here: token storage lives in tokenStore.ts,
 * session state lives in AuthContext. Each module does one
 * thing.
 * ============================================================
 */

export interface AuthSessionResponse {
  token: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    avatar: string;
  };
}

export interface RefreshResult {
  token: string;
  user?: AuthSessionResponse["user"];
}

/**
 * Exchanges the stored refresh token for a fresh access token.
 * Returns null when there is no refresh token or the backend
 * rejects it — the caller should treat that as "logged out".
 */
export const refreshAccessToken = async (): Promise<RefreshResult | null> => {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken,
    });

    const { token, user } = response.data ?? {};

    return token ? { token, user } : null;
  } catch {
    // Refresh token expired/revoked — caller should sign out.
    return null;
  }
};

// Authentication function for login
export const loginUser = async (
  email: string,
  password: string,
): Promise<AuthSessionResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Login failed";
      throw new Error(message);
    }

    throw new Error("An unexpected error occurred");
  }
};

// Authentication function for Registration
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  avatar: string,
): Promise<AuthSessionResponse> => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/register`,
      {
        name,
        email,
        password,
        avatar,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        "Registration failed";
      throw new Error(message);
    }

    throw new Error("An unexpected error occurred");
  }
};
