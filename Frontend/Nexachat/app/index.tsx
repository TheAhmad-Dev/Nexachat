  // import { StatusBar, StyleSheet, Text, View  , Image} from "react-native";
  // import React, { useEffect } from "react";
  // import { colors } from "@/constants/theme";
  // import Animated, { FadeInDown } from "react-native-reanimated";
  // import { router, useRouter } from "expo-router";

  // const SplashScreen = () => {
  //   const router = useRouter();
  //   useEffect(() => {
  //     setTimeout(() => {
  //       router.replace("/(auth)/welcome");
  //     }, 1500);
  //   }, []);

  //   return (
  //     <View style={styles.container}>
  //       <StatusBar
  //         barStyle={"light-content"}
  //         backgroundColor={colors.neutral900}
  //       />
  //       <Animated.Image
  //         source={require("../assets/images/SplashScreenLogo.png")}
  //         entering={FadeInDown.duration(650).springify()}
  //         style={styles.logo}
  //         resizeMode={"contain"}
  //       />


  //     </View>
  //   );
  // };

  // export default SplashScreen;

  // const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     alignItems: "center",
  //     justifyContent: "center",
  //     backgroundColor: colors.neutral900,
  //   },
  //   logo: {
  //     height: "24%",
  //     aspectRatio: 1,
  //   },
  // });







import { StatusBar, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import { colors, gradientTheme } from "@/constants/theme";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const SplashScreen = () => {
  const router = useRouter();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(auth)/welcome");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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
      <View style={styles.container}>
        <StatusBar
          barStyle={"light-content"}
          backgroundColor="transparent"
          translucent
        />
        <Animated.Image
          source={require("@/assets/images/LogoDraft.png")}
          entering={FadeInDown.duration(850).springify()}
          style={styles.logo}
          resizeMode={"contain"}
        />
      </View>
    </LinearGradient>
  );
};

export default SplashScreen;

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
  logo: {
    height: "24%",
    aspectRatio: 1,
  },
});