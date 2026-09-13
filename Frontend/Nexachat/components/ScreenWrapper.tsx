// import {
//   Dimensions,
//   ImageBackground,
//   Platform,
//   StatusBar,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import React from "react";
// import { ScreenWrapperProps } from "@/types";
// import { colors } from "@/constants/theme";

// const { height } = Dimensions.get("screen");
// const STATUS_BAR_HEIGHT =
//   Platform.OS === "android" ? StatusBar.currentHeight : 0;

// const ScreenWrapper = ({
//   style,
//   showPattren = false,
//   backgroundOpacity = 1,
//   // isModal = true,
//   isModal = false,
//   children,
// }: ScreenWrapperProps) => {
//   let paddingTop = Platform.OS == "ios" ? height * 0.06 : 40;
//   let paddingBottom = 0;
//   if (isModal) {
//     paddingTop = Platform.OS == "ios" ? height * 0.02 : 45;
//     paddingBottom = height * 0.02;
//   }
//   return (
//     <ImageBackground
//       style={{
//         flex: 1,
//         backgroundColor: isModal ? colors.white : colors.neutral900,
//         marginTop: STATUS_BAR_HEIGHT,
//       }}
//       imageStyle={{ opacity: showPattren ? backgroundOpacity : 0 }}
//       source={require("../assets/images/bgtheme.png")}
//     >
//       <View style={[{ paddingTop, paddingBottom, flex: 1 }, style]}>
//         <StatusBar
//           barStyle={"dark-content"}
//           backgroundColor={"transparent"}
//           translucent
//         />
//         {children}
//       </View>
//     </ImageBackground>
//   );
// };

// export default ScreenWrapper;

// const styles = StyleSheet.create({});
import {
  Dimensions,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { ScreenWrapperProps } from "@/types";
import { colors, gradientTheme } from "@/constants/theme";

// ===== NEW: Gradient Support =====
import { LinearGradient } from "expo-linear-gradient";

// ===== NEW: Safe Area Support =====
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height } = Dimensions.get("screen");

const STATUS_BAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight : 0;

const ScreenWrapper = ({
  style,
  showPattren = false,

  // ===== UPDATED: Changed default opacity to match new design =====
  backgroundOpacity = 0.05,

  // isModal = true,
  isModal = false,
  children,
}: ScreenWrapperProps) => {

  // ===== NEW =====
  const insets = useSafeAreaInsets();

  // ===== UPDATED =====
  // Original padding logic replaced with Safe Area Insets
  let paddingTop = isModal ? insets.top * 0.6 : insets.top;
  let paddingBottom = isModal ? insets.bottom + 16 : insets.bottom;

  return (
    // ===== NEW: Gradient Background =====
    <LinearGradient
      colors={[
        gradientTheme.stop1,
        gradientTheme.stop2,
        gradientTheme.stop3,
        gradientTheme.stop4,
        gradientTheme.stop5,
      ]}
      locations={[0, 0.28, 0.55, 0.75, 1]}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={{
        flex: 1,
        backgroundColor: isModal
          ? colors.white
          : gradientTheme.bgPureBlack,
      }}
    >
      <ImageBackground
        style={{
          flex: 1,

          // ===== ORIGINAL =====
          marginTop: STATUS_BAR_HEIGHT,
        }}
        imageStyle={{ opacity: showPattren ? backgroundOpacity : 0 }}
        source={require("../assets/images/bgtheme.png")}
      >
        <View style={[{ paddingTop, paddingBottom, flex: 1 }, style]}>
          {/* ===== UPDATED ===== */}
          <StatusBar
            barStyle={"light-content"}
            backgroundColor={"transparent"}
            translucent
          />

          {children}
        </View>
      </ImageBackground>
    </LinearGradient>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({});