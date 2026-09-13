// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import React from "react";
// import { CaretLeft } from "phosphor-react-native";
// import { router } from "expo-router";
// import { colors } from "@/constants/theme";
// import { VerticalScale } from "@/utils/styling";
// import { BackButtonProps } from "@/types";
// const BackButton = ({ iconsize = 25, style, color }: BackButtonProps) => {
//   return (
//     <TouchableOpacity
//       onPress={() => router.back()}
//       style={[styles.button, styles]}
//     >
//       <CaretLeft color={color} size={VerticalScale(iconsize)} weight="bold" />
//     </TouchableOpacity>
//   );
// };

// export default BackButton;

// const styles = StyleSheet.create({
//   button: {}, // back button ka yeh potion khali chor dain gay
// });

import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { CaretLeft } from "phosphor-react-native";
import { router } from "expo-router";
import { colors } from "@/constants/theme";
import { VerticalScale } from "@/utils/styling";
import { BackButtonProps } from "@/types";

const BackButton = ({
  iconsize = 25,
  style,
  color,
  onPress,
}: BackButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress || (() => router.back())}
      style={[styles.button, style]}
      hitSlop={15}
    >
      <CaretLeft
        color={color || colors.black}
        size={VerticalScale(iconsize)}
        weight="bold"
      />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
});