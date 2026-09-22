import { AuthContextProps, UserProps } from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "expo-router";
import { loginUser, registerUser, refreshAccessToken } from "@/services/authservices";
import {
  getAccessToken,
  saveAuthSession,
  clearTokens,
  decodeAccessToken,
  isTokenExpired,
} from "@/services/tokenStore";
import { ConnectSocket, disconnectSocket } from "@/socket/sockets";
import { registerAndSavePushToken } from "@/services/notificationService";

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  user: null,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  updateToken: function (token: string): Promise<void> {
    throw new Error("Function not implemented.");
  },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProps | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Any restore failure lands on the welcome screen.
    loadToken().catch((error) => {
      console.log("Failed to restore the session:", error);
      goTOWlecomeScreen();
    });
  }, []);

  const goTOHomeScreen = () => {
    setTimeout(() => {
      router.replace("/(main)/home");
    }, 1500);
  };
  const goTOWlecomeScreen = () => {
    setTimeout(() => {
      router.replace("/(auth)/welcome");
    }, 1500);
  };

  /** Persists a token and syncs session state from its claims. */
  const adoptSession = async (token: string) => {
    await saveAuthSession({ token });
    setToken(token);
    setUser(decodeAccessToken(token).user);
  };

  /** Connects the socket, swallowing failure so login still completes. */
  const connectSocketSafely = async () => {
    try {
      await ConnectSocket();
    } catch (error) {
      console.log("Socket connection failed:", error);
    }
  };

  // Checks whether the user is already logged in on boot.
  const loadToken = async () => {
    const storedToken = await getAccessToken();

    if (!storedToken) {
      goTOWlecomeScreen();
      return;
    }

    if (isTokenExpired(storedToken)) {
      /*
       * Access token expired. Tokens are short-lived (15m) so
       * this is the NORMAL path for a returning user, not an
       * error. Try a silent refresh before giving up.
       */
      const refreshed = await refreshAccessToken();

      if (refreshed?.token) {
        await adoptSession(refreshed.token);
        await connectSocketSafely();
        goTOHomeScreen();
        return;
      }

      // Refresh also failed -> truly logged out.
      await clearTokens();
      goTOWlecomeScreen();
      return;
    }

    // Token still valid — user is logged in.
    setToken(storedToken);
    setUser(decodeAccessToken(storedToken).user);
    await connectSocketSafely();
    goTOHomeScreen();
  };

  const updateToken = async (token: string) => {
    await adoptSession(token);
  };

  const completeSignIn = async (session: { token: string; refreshToken?: string }) => {
    await saveAuthSession(session);
    setToken(session.token);
    setUser(decodeAccessToken(session.token).user);
    await ConnectSocket();
    await registerAndSavePushToken(session.token);
    router.replace("/(main)/home");
  };

  const signIn = async (email: string, password: string) => {
    await completeSignIn(await loginUser(email, password));
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
    avatar?: string | null,
  ) => {
    await completeSignIn(
      await registerUser(name, email, password, avatar ?? "")
    );
  };

  const signOut = async () => {
    await clearTokens();
    await disconnectSocket();
    setToken(null);
    setUser(null);
    router.replace("/(auth)/welcome");
  };
  return (
    <AuthContext.Provider
      value={{ token, user, signIn, signOut, signUp, updateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
