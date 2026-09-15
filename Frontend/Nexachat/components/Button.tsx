// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   ActivityIndicatorBase,
//   ActivityIndicator,
// } from "react-native";
// import React from "react";
// import { ButtonProps } from "@/types";
// import { VerticalScale } from "@/utils/styling";
// import { colors } from "@/constants/theme";

// const Button = ({ onPress, loading = false, style, children }: ButtonProps) => {
//   return (
//     <TouchableOpacity
//       onPress={loading ? undefined : onPress}
//       disabled={loading}
//       style={[style, styles.Button]}
//     >
//       {loading ? (
//         <ActivityIndicator color={colors.white} size="small" />
//       ) : (
//         children
//       )}
//     </TouchableOpacity>
//   );
// };

// export default Button;

// const styles = StyleSheet.create({
//   Button: {
//     borderCurve: "continuous",
//     alignSelf: "center",
//     justifyContent: "center",
//     height: VerticalScale(55),
//     // backgroundColor: colors.myBubble,
//     borderRadius: 18,
//     //     height: VerticalScale(55),
//     // width: VerticalScale(55),
//     // borderRadius: 100,
//     // backgroundColor: colors.primary, // or colors.warmOrange
//     // position: "absolute",
//     // bottom: VerticalScale(30),
//     // right: VerticalScale(30),
//     // justifyContent: "center",
//     // alignItems: "center",
//   },
// });
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

import { ButtonProps } from "@/types";
import { VerticalScale } from "@/utils/styling";
import { colors } from "@/constants/theme";

interface ExtendedButtonProps extends ButtonProps {
  gradientColors?: readonly [string, string, ...string[]];
}

const Button = ({
  onPress,
  loading = false,
  style,
  children,
  gradientColors,
}: ExtendedButtonProps) => {
  return (
    <TouchableOpacity
      onPress={loading ? undefined : onPress}
      disabled={loading}
      style={[style, styles.Button]}
    >
      {/* Gradient Background */}
      {gradientColors && (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: 18 },
          ]}
        />
      )}

      {loading ? (
        <ActivityIndicator color={colors.white} size="small" />
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  Button: {
    borderCurve: "continuous",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    height: VerticalScale(55),
    borderRadius: 18,
    overflow: "hidden", // Required so the gradient respects the border radius
  },
});