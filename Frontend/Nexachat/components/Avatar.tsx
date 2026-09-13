import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AvatarProps } from "@/types";
import { VerticalScale } from "@/utils/styling";
import { colors, radius } from "@/constants/theme";
import { getAvatarPathfrom } from "@/services/imageService";
import { Image } from "expo-image";
const Avatar = ({
  uri = null,
  size = 40,
  isGroup = false,
  style,
}: AvatarProps) => {

  const imageSource = uri && uri.trim() !== ""
    // ? getAvatarPathfrom(uri, isGroup)  nechay wali line 
     ? { uri: uri.trim() }
    : require("@/assets/images/Avatar.png");

  return (
    <View
      style={[
        styles.avatar,
        { 
          width: VerticalScale(size), 
          height: VerticalScale(size) 
        },
        style,
      ]}
    >
      <Image
        style={{ flex: 1 }}
        contentFit="cover"
        source={imageSource}
        transition={100}
      />
    </View>
  );
};
export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral200,
    height: VerticalScale(47),
    width: VerticalScale(47),
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.neutral100,
    overflow: "hidden",
  },
});
