
import Constants from "expo-constants";
import { Platform } from "react-native";

/*
 * ============================================================
 * Nexachat — runtime API configuration (single source of truth)
 * ============================================================
 *
 * WHY THIS FILE EXISTS
 *
 * The app used to hard-code the development PC's WiFi IP
 * (e.g. http://192.168.1.9:3000) inside .env.local. Every time
 * the PC's IP changed (new WiFi, DHCP lease, hotspot, ...),
 * login / signup / sockets silently stopped working until the
 * IP was edited by hand.
 *
 * HOW IT WORKS NOW
 *
 * 1. When the app runs in Expo Go (or a dev client), it asks
 *    Expo for the host of the Metro bundler the app was loaded
 *    from. That host IS the PC's current LAN IP, discovered at
 *    runtime — no manual IP entry, ever.
 *
 * 2. If EXPO_PUBLIC_API_URL is set in .env.local it is used as
 *    an explicit override (e.g. to pin a deployed backend).
 *    Leave it empty for automatic detection.
 *
 * 3. Otherwise sensible platform defaults are used:
 *      - web          -> http://localhost:PORT
 *      - iOS sim      -> http://localhost:PORT
 *      - Android emu  -> http://10.0.2.2:PORT (host loopback alias)
 *
 * The backend must listen on 0.0.0.0 (it already does in
 * App_Backend/index.ts) so devices on the same WiFi can reach it.
 *
 * NOTE: .env.local values are inlined at bundle time — restart
 * Metro (`npx expo start -c`) after editing this file or .env.local.
 * ============================================================
 */

/** Backend port. Override with EXPO_PUBLIC_API_PORT in .env.local. */
const API_PORT = process.env.EXPO_PUBLIC_API_PORT?.trim() || "3000";

type Maybe<T> = T | null | undefined;

/** Reads the hostname part of a "host:port" or "[v6]:port" pair. */
const getHostname = (hostUri: string): string | null => {
  if (hostUri.startsWith("[")) {
    const end = hostUri.indexOf("]");
    return end === -1 ? null : hostUri.slice(1, end);
  }

  const colonIndex = hostUri.lastIndexOf(":");
  const host = colonIndex === -1 ? hostUri : hostUri.slice(0, colonIndex);

  return host.trim() || null;
};

/**
 * The LAN host Expo used to load this bundle, e.g. "192.168.1.9".
 * Returns null when it cannot be determined (production builds,
 * tunnel mode, plain web deploy, ...).
 */
const resolveExpoLanHost = (): string | null => {
  const hostUri =
    // Expo Go / dev clients on recent SDKs
    (Constants.expoConfig as Maybe<{ hostUri?: string }>)?.hostUri ??
    // Expo Go on older SDKs
    (Constants.expoGoConfig as Maybe<{ debuggerHost?: string }>)
      ?.debuggerHost ??
    // Legacy manifest fallback
    (Constants.manifest as Maybe<{ debuggerHost?: string }>)?.debuggerHost;

  if (typeof hostUri !== "string" || hostUri.length === 0) {
    return null;
  }

  const hostname = getHostname(hostUri);

  // Tunnel mode (*.exp.direct) only forwards Metro, not the API
  // on :3000, so it must NOT be used as the backend host.
  if (
    !hostname ||
    hostname.endsWith(".exp.direct") ||
    hostname.endsWith(".expo.dev")
  ) {
    return null;
  }

  return hostname;
};

const normalizeEnvUrl = (value: string): string => {
  const trimmed = value.trim().replace(/\/+$/, "");

  if (trimmed.length === 0) {
    return "";
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
};

const buildApiUrl = (): string => {
  // 1) Explicit override from .env.local (pin a specific backend).
  const fromEnv = normalizeEnvUrl(process.env.EXPO_PUBLIC_API_URL ?? "");

  if (fromEnv) {
    return fromEnv;
  }

  // 2) Automatic LAN detection while developing with Expo.
  const lanHost = resolveExpoLanHost();

  if (lanHost) {
    return `http://${lanHost}:${API_PORT}`;
  }

  // 3) Platform defaults.
  if (Platform.OS === "android") {
    // The Android emulator reaches the host machine via this alias.
    return `http://10.0.2.2:${API_PORT}`;
  }

  // Web on the same machine + iOS simulator.
  return `http://localhost:${API_PORT}`;
};

export const API_URL = buildApiUrl();

if (__DEV__) {
  console.log(`[Nexachat] API_URL resolved to: ${API_URL}`);
}

export const CLOUDINARY_CLOUD_NAME = "yv7ffnux";
export const CLOUDINARY_UPLOAD_PRESET = "Nexachat";