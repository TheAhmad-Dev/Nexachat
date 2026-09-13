import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { HeaderProps } from "@/types";
import Typos from "./typos";

const Header = ({ title = "", leftIcon, rightIcon, style }: HeaderProps) => {
  return (
    <View style={[styles.container, style]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

      {title ? (
        <Typos size={24} fontWeight="bold" style={styles.title}>
          {title}
        </Typos>
      ) : null}

      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  title: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    zIndex: 10,
  },

  leftIcon: {
    alignSelf: "flex-start",
    zIndex: 20,
  },

  rightIcon: {
    alignSelf: "flex-end",
    zIndex: 30,
  },
});
