import { AuthContextProps, DecodedTokenProps, UserProps } from "@/types";
import {
  Children,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { loginUser, registerUser } from "@/services/authservices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "expo-router";
import { store } from "expo-router/build/global-state/router-store";
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
    loadToken();
  }, []);

  //This is the function to check weather the user is already logged in or not
  const loadToken = async () => {
    const StoredToekn = await AsyncStorage.getItem("token");
    if (StoredToekn) {
      try {
        const decoded = jwtDecode<DecodedTokenProps>(StoredToekn);
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
          await AsyncStorage.removeItem("token");
          goTOWlecomeScreen();
          return;
        }
        //user is logged in
        setToken(StoredToekn);
        setUser(decoded.user);
        try {
          await ConnectSocket();
        } catch (error) {
          console.log("Socket connection failed:", error);
        }
        goTOHomeScreen();
      } catch (error) {
        console.log("Failed to decode the Token ", error);
      }
    } else {
      goTOWlecomeScreen();
    }
  };
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
  // const updateToken= async (token : string)=>{
  // if(token){
  //      //storge of user token in the Acsync Local Storage
  //      await AsyncStorage.setItem("token" , token );
  //      //now decoding the stored user token
  //      const decodevalue = jwtDecode<DecodedTokenProps>(token)
  //      console.log("decoded token of user : " , token )
  //      setUser(decodevalue.user)

  //      }
  // }
  const updateToken = async (token: string) => {
    if (token) {
      await AsyncStorage.setItem("token", token);

      const decodedValue = jwtDecode<DecodedTokenProps>(token);

      setToken(token);
      setUser(decodedValue.user);
      console.log("Decoded Token:", decodedValue);
    }
  };

 
  const signIn = async (email: string, password: string) => {

      // Login the user through your backend.
    const Response = await loginUser(email, password);
      // Save the JWT token and update the logged-in user.
    await updateToken(Response.token);
      // Connect the user to Socket.IO for real-time messaging.
    await ConnectSocket();

/*
   * For now, we only print the token.
   *
   * In the next step, we will send this token to your
   * backend and save it with this user's account.
   */


const pushToken =
  await registerAndSavePushToken(Response.token);

console.log(
  "Push token after login:",
  pushToken
);

    router.replace("/(main)/home");
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
    avatar?: string | null,
  ) => {
     // Create the new account through your backend.
    const Response = await registerUser(name, email, password, avatar ?? "");
      // Save the JWT and update the logged-in user.
    await updateToken(Response.token);

     // Connect the new user to Socket.IO.
    await ConnectSocket();

/*
   * For now, we only print the token.
   *
   * In the next step, we will send this token to your
   * backend and save it with this user's account.
   */
const pushToken =
  await registerAndSavePushToken(Response.token);

console.log(
  "Push token after login:",
  pushToken
);
    router.replace("/(main)/home");
  };
  const signOut = async () => {
    await AsyncStorage.removeItem("token"); //here we are pausing the key
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
