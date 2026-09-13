import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "@/constants/theme";
import { BackButtonProps } from "@/types";
import { useRouter } from "expo-router";
import { Power } from "phosphor-react-native";
import { VerticalScale } from "@/utils/styling";

import { useAuth } from "@/context/authcontext";

const LogoutButton = ({
  style,
  color = colors.myBubble,
  iconsize = 26,
}: BackButtonProps) => {
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <TouchableOpacity onPress={signOut} style={[styles.button, style]}>
      <Power size={VerticalScale(iconsize)} color={color} weight="bold" />
    </TouchableOpacity>
  );
};

export default LogoutButton;

const styles = StyleSheet.create({
  button: {},
});
