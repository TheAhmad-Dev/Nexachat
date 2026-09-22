import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Google from "expo-auth-session/providers/google";
import axios from "axios";

import { API_URL } from "@/constants/config";
import { VerticalScale } from "@/utils/styling";

/*
 * ============================================================
 * GoogleButton — "Continue with Google" (self-contained)
 * ============================================================
 *
 * Owns the whole Google flow internally:
 *
 *   1. promptAsync()  -> Google account picker (native on
 *      Android/iOS via expo-auth-session)
 *   2. response       -> contains the Google ID token
 *   3. POST /auth/google with { idToken } -> the app's normal
 *      session { token, refreshToken, user }
 *   4. onSession(session) -> hand it to the caller
 *
 * NOTHING here imports the auth context — the screen decides
 * what a session means (AuthContext.signInWithGoogle, or a
 * test harness). That keeps this file drop-in reusable.
 *
 * SETUP (one-time, in Google Cloud Console):
 *   - Create an OAuth 2.0 Client ID of type "Web application"
 *     -> EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in .env.local
 *   - Create one of type "Android" with your package name
 *     com.ahmad7.Nexachat and your SHA-1 fingerprint
 *     -> the backend also needs GOOGLE_CLIENT_ID (the web one)
 *        and GOOGLE_ANDROID_CLIENT_ID in App_Backend/.env
 *   - No client secret is used anywhere (public clients).
 * ============================================================
 */

export interface GoogleButtonSession {
  token: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    avatar: string;
  };
}

interface GoogleButtonProps {
  /** Called with the app session after a successful Google sign-in. */
  onSession: (session: GoogleButtonSession) => void | Promise<void>;
  /** Called when the flow fails or is cancelled. */
  onError?: (message: string) => void;
  disabled?: boolean;
}

const GoogleButton = ({
  onSession,
  onError,
  disabled = false,
}: GoogleButtonProps) => {
  const [isBusy, setIsBusy] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "",
    androidClientId:
      process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? undefined,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? undefined,
    scopes: ["openid", "profile", "email"],
  });

  // React to the Google flow completing.
  useEffect(() => {
    if (!response) {
      return;
    }

    if (response.type !== "success") {
      // "cancel", "dismiss", "locked", "opened", "error" — the
      // user backed out or the flow could not start.
      return;
    }

    const idToken =
      response.authentication?.idToken ??
      (response.params as Record<string, string> | undefined)?.id_token;

    if (!idToken) {
      onError?.("Google sign-in did not return a token. Try again.");
      return;
    }

    const exchangeWithBackend = async () => {
      setIsBusy(true);

      try {
        const backendResponse = await axios.post(`${API_URL}/auth/google`, {
          idToken,
        });

        await onSession(backendResponse.data);
      } catch (error: any) {
        const message =
          error?.response?.data?.msg ||
          error?.message ||
          "Google sign-in failed";

        onError?.(message);
      } finally {
        setIsBusy(false);
      }
    };

    void exchangeWithBackend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || isBusy || !request}
      onPress={() => void promptAsync()}
      style={[styles.button, disabled && styles.buttonDisabled]}
    >
      {isBusy ? (
        <ActivityIndicator size="small" color="#1F1F1F" />
      ) : (
        <View style={styles.contentRow}>
          <Text style={styles.googleG}>
            <Text style={{ color: "#4285F4" }}>G</Text>
            <Text style={{ color: "#EA4335" }}>o</Text>
            <Text style={{ color: "#FBBC05" }}>o</Text>
            <Text style={{ color: "#4285F4" }}>g</Text>
            <Text style={{ color: "#34A853" }}>l</Text>
            <Text style={{ color: "#EA4335" }}>e</Text>
          </Text>

          <Text style={styles.label}>Continue with Google</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default GoogleButton;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: VerticalScale(50),
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DADCE0",
    borderTopLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  googleG: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F1F1F",
  },
});
