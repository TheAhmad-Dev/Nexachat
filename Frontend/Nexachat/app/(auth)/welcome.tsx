// import { StyleSheet, Text, View } from "react-native";
// import React from "react";
// import ScreenWrapper from "@/components/ScreenWrapper";
// import { colors, spacingX, spacingY , gradientTheme} from "@/constants/theme";
// import { Background } from "@react-navigation/elements";
// import { VerticalScale } from "@/utils/styling";
// import Typos from "@/components/typos";
// import Button from "@/components/Button";
// import Animated, { FadeInDown } from "react-native-reanimated";

// import { useRouter } from "expo-router";

// const Welcome = () => {
//   const router = useRouter();
//   return (
//     <ScreenWrapper showPattren={true}>
//       <View style={styles.container}>
//         <View style={{ alignItems: "center" }}>
//           <Typos
//             color={colors.myBubble}
//             size={39}
//             fontWeight={"900"}
//             style={{ paddingBottom: 13 }}
//           >
//             Nexa Chat
//           </Typos>
//           <Animated.Image
//             source={require("../../assets/images/3Dboywelcome.png")}
//             entering={FadeInDown.duration(900).springify()}
//             resizeMode={"contain"}
//             style={styles.WelcomeImage}
//           />
//         </View>
//         <View style={{ alignItems: "center" }}>
//           <Typos color={colors.white} size={35} fontWeight={"900"}>
//             Stay Connected
//           </Typos>
//           <Typos color={colors.myBubble} size={35} fontWeight={"900"}>
//             With your Family
//           </Typos>
//           <Typos color={colors.white} size={35} fontWeight={"900"}>
//             and Friends
//           </Typos>
//           <Button
//             onPress={() => router.push("/(auth)/register")}
//             style={{
//               backgroundColor: colors.myBubble,
//               width: 200,
//               height: 45,
//               borderRadius: 12,
//               borderColor: colors.white,
//               borderWidth: 1.5,
//               marginTop: 55,
//               marginBottom: 22,
//               paddingLeft: 34,
//             }}
//           >
//             <Typos color={colors.black} size={25} fontWeight={"bold"}>
//               Get Started
//             </Typos>
//           </Button>
//         </View>
//       </View>
//     </ScreenWrapper>
//   );
// };

// export default Welcome;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "space-around",
//     paddingTop: spacingX._20,
//     marginVertical: spacingY._10,
//   },
//   Background: {
//     flex: 1,
//     backgroundColor: colors.neutral900,
//   },
//   WelcomeImage: {
//     alignSelf: "center",
//     height: VerticalScale(380),
//     aspectRatio: 1,
//   },
// });
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";

import {
  colors,
  spacingX,
  spacingY,
  gradientTheme,
  radius,
} from "@/constants/theme";

import { Background } from "expo-router/react-navigation";
import { VerticalScale } from "@/utils/styling";
import Typos from "@/components/typos";
import Button from "@/components/Button";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";

const Welcome = () => {
  const router = useRouter();

  return (
    <ScreenWrapper showPattren={true}>
      <View style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <Typos
            // ===== UPDATED =====
            color={gradientTheme.tanBrown}
            size={40}
            fontWeight={"800"}
            style={{ paddingBottom: spacingY._12 }}
          >
            Nexa Chat
          </Typos>

          <Animated.Image
            source={require("../../assets/images/3Dboywelcome.png")}
            entering={FadeInDown.duration(900).springify()}
            resizeMode={"contain"}
            style={styles.WelcomeImage}
          />
        </View>

        <View style={{ alignItems: "center" }}>
          <Typos
            color={colors.white}
            // ===== UPDATED =====
            size={33}
            fontWeight={"800"}
          >
            Stay Connected
          </Typos>

          <Typos
            // ===== UPDATED =====
            color={gradientTheme.tanBrown}
            size={33}
            fontWeight={"800"}
          >
            With your Family
          </Typos>

          <Typos
            // ===== UPDATED =====
            color={gradientTheme.accentTeal}
            size={33}
            fontWeight={"800"}
          >
            & Friends
          </Typos>

          <Button
            onPress={() => router.push("/(auth)/register")}

            // ===== NEW: Gradient Button =====
            gradientColors={[
              gradientTheme.ctaStart,
              gradientTheme.ctaMid1,
              gradientTheme.ctaMid2,
              gradientTheme.ctaEnd,
            ]}
            style={{
              // ===== UPDATED =====
              width: "90%",
              height: VerticalScale(58),
              borderRadius: radius._30,
              marginTop: spacingY._50,
              marginBottom: spacingY._20,
              paddingHorizontal: spacingX._30,
            }}
          >
            <Typos
              // ===== UPDATED =====
              color={gradientTheme.bgPureBlack}
              size={17}
              fontWeight={"800"}
            >
              Get Started
            </Typos>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    paddingTop: spacingX._20,
    marginVertical: spacingY._10,
  },

  // ===== ORIGINAL =====
  Background: {
    flex: 1,
    backgroundColor: colors.neutral900,
  },

  WelcomeImage: {
    alignSelf: "center",
    height: VerticalScale(380),
    aspectRatio: 1,
  },
});