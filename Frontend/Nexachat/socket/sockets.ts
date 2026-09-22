import { API_URL } from "@/constants/config";
import { io, Socket } from "socket.io-client";
import {
  getAccessToken,
  saveAccessToken,
} from "@/services/tokenStore";
import { refreshAccessToken } from "@/services/authservices";

let socket: Socket | null = null;
let attemptedRefreshOnThisDrop = false;

/** Refresh and persist a fresh access token — once per drop. */
async function refreshOnAuthError(): Promise<void> {
  if (attemptedRefreshOnThisDrop) {
    return;
  }

  attemptedRefreshOnThisDrop = true;

  const result = await refreshAccessToken();

  if (result?.token) {
    await saveAccessToken(result.token);
  }
}

export async function ConnectSocket(): Promise<Socket> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error("No token found");
  }

  if (!socket) {
    /*
     * `auth` as a callback is evaluated on EVERY connection
     * attempt (initial connect + every reconnect), so after an
     * access-token refresh the next retry automatically sends
     * the new token — no stale 15-minute-token problem.
     */
    socket = io(API_URL, {
      auth: async (cb) => {
        const latestToken = await getAccessToken();
        cb({ token: latestToken });
      },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
      attemptedRefreshOnThisDrop = false;
    });

    socket.on("connect_error", (error) => {
      console.log("Socket connection error:", error.message);

      // Expired access token -> try to refresh it once per drop;
      // the next reconnect attempt will pick up the new token.
      const message = error.message.toLowerCase();

      if (message.includes("token") || message.includes("authentication")) {
        void refreshOnAuthError();
      }
    });
  }

  return socket;
}
export function getSocket(): Socket | null {
  return socket;
}
export function disconnectSocket(): void {
  if (socket) {
    socket?.disconnect();
    socket = null;
  }
}
