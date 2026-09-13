import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TypoProps } from "@/types";
import { colors } from "@/constants/theme";
import { VerticalScale } from "@/utils/styling";

const Typos = ({
  size = 15,
  fontWeight = "300",
  color = colors.text,
  children,
  textProps = {},
  style,
}: TypoProps) => {
  const textStyle = {
    fontSize: VerticalScale(size),
    color,
    fontWeight,
  };
  return (
    <Text style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typos;
