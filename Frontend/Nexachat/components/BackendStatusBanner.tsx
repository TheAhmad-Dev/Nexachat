import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { verifyApiConnection } from "@/services/apiHealth";
import { colors, spacingX, spacingY } from "@/constants/theme";

/*
 * ============================================================
 * BackendStatusBanner
 * ============================================================
 *
 * Runs verifyApiConnection() on mount and every 30s. When the
 * backend is unreachable it slides down a red banner with a
 * manual "Retry" button — so "no login / no messages" is never
 * mysterious again.
 *
 * Render it ONCE near the root of the app (see app/_layout.tsx).
 * ============================================================
 */

const CHECK_INTERVAL_MS = 30_000;

const BackendStatusBanner: React.FC = () => {
  const [isDown, setIsDown] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const slideAnim = useRef(new Animated.Value(-60)).current;

  const runCheck = useCallback(async (): Promise<boolean> => {
    setIsRetrying(true);
    const ok = await verifyApiConnection();
    setIsDown(!ok);
    setIsRetrying(false);
    return ok;
  }, []);

  useEffect(() => {
    runCheck();

    const interval = setInterval(runCheck, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [runCheck]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isDown ? 0 : -60,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isDown, slideAnim]);

  if (!isDown) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.banner,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>Can't reach the server</Text>
        <Text style={styles.subtitle}>
          Check your internet / WiFi and make sure the backend is running.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.retryButton}
        onPress={runCheck}
        disabled={isRetrying}
        activeOpacity={0.7}
      >
        <Text style={styles.retryText}>
          {isRetrying ? "..." : "Retry"}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: "#C0392B",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: spacingY._10 ?? 40,
    paddingBottom: 12,
    paddingHorizontal: spacingX._15 ?? 16,
    gap: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  subtitle: {
    color: "#FFE8E8",
    fontSize: 12,
    marginTop: 2,
  },
  retryButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
});

export default BackendStatusBanner;
