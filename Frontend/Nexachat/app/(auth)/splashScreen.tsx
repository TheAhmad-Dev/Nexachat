import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { gradientTheme, colors } from "@/constants/theme";
// import { SafeAreaView } from "react-native-safe-area-context";

export default function SplashScreen() {
  // Animated values for scale and opacity
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Springify animation effect on mount
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,     // Controls the "bounciness" (lower = more bouncy)
        tension: 40,     // Controls speed
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  return (
    <LinearGradient
      colors={[
        gradientTheme.stop1,
        gradientTheme.stop2,
        gradientTheme.stop3,
        gradientTheme.stop4,
        gradientTheme.stop5,
      ]}
      locations={[0, 0.25, 0.5, 0.75, 1]}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Animated.Image
            source={require("@/assets/images/Applogo.png")} 
            style={[
              styles.logo,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 140,  // Adjust width/height based on your logo proportions
    height: 140,
  },
});