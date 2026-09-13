import {
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";

import { InputProps } from "@/types";
import {
  colors,
  radius,
  spacingX,
  spacingY,
} from "@/constants/theme";

import { VerticalScale } from "@/utils/styling";

const Input = (props: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        props.containerStyle,
        isFocused && styles.primaryBorder,
      ]}
    >
      {props.icon && props.icon}

      <TextInput
        {...props}
        style={[
          styles.input,
          props.inputStyle,
        ]}
        placeholderTextColor={
          colors.neutral500
        }
        ref={props.inputRef}
        onFocus={(event) => {
          setIsFocused(true);
          props.onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          props.onBlur?.(event);
        }}
        multiline={props.multiline}
        textAlignVertical={
          props.multiline
            ? "top"
            : "center"
        }
      />

      {props.rightIcon &&
        props.rightIcon}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    width: "100%",

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    /*
     * IMPORTANT:
     * Do not use a fixed height here.
     *
     * Chatting.tsx controls the minimum/maximum
     * height of the chat composer.
     */
    minHeight: VerticalScale(55),

    backgroundColor:
      colors.neutral100,

    borderWidth: 2,

    borderColor:
      colors.neutral300,

    borderRadius:
      radius.full,

    gap: spacingY._15,

    paddingHorizontal:
      spacingX._15,

    marginTop: 0,

    overflow: "hidden",
  },

  primaryBorder: {
    borderColor:
      colors.primary,
  },

  input: {
    flex: 1,

    width: "100%",

    color: colors.text,

    fontSize:
      VerticalScale(16),

    /*
     * Gives the text enough vertical room.
     */
    paddingVertical:
      VerticalScale(7),

    /*
     * Multiline inputs need to start at the
     * top rather than being vertically centered.
     */
    textAlignVertical: "top",

    /*
     * Prevents Android from adding unexpected
     * extra font padding.
     */
    includeFontPadding: false,
  },
});