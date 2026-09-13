import { API_URL } from "@/constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export async function ConnectSocket(): Promise<Socket> {
  const token = await AsyncStorage.getItem("token");

  if (!token) {
    throw new Error("No token found");
  }

  if (!socket) {
   socket = io(API_URL, {
  auth: {
    token,
  },
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
    });

    socket.on("connect_error", (error) => {
      console.log("Socket connection error:", error.message);
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
