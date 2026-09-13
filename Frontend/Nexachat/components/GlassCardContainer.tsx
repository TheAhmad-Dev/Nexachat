import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Icon from "phosphor-react-native";

import { scale, VerticalScale } from "@/utils/styling";

import BackButton from "./BackButton";
import Avatar from "./Avatar";

interface GlassCardContainerProps {
  name: string;
  avatar?: string | null;
  isGroup?: boolean;
  onVideoPress?: () => void;
  onCallPress?: () => void;
}

const GlassCardContainer = ({
  name,
  avatar,
  isGroup = false,
  onVideoPress,
  onCallPress,
}: GlassCardContainerProps) => {
  return (
    <View style={styles.outerContainer}>
      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 0.28)",
          "rgba(255, 255, 255, 0.14)",
          "rgba(255, 255, 255, 0.06)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.glassCard}
      >
        <View style={styles.highlight} />

        {/* ================= LEFT SECTION ================= */}
        <View style={styles.leftSection}>
          <BackButton
            iconsize={24}
            color="rgba(255,255,255,0.95)"
            style={styles.backButton}
          />

          <Avatar
            size={44}
            uri={avatar ?? null}
            isGroup={isGroup}
            style={styles.avatar}
          />

          <View style={styles.userInfo}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              style={styles.userName}
            >
              {name}
            </Text>

          </View>
        </View>

        {/* ================= ACTION BUTTONS ================= */}
        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.72}
            onPress={onCallPress}
            style={styles.actionButton}
          >
            <Icon.VideoCameraIcon
              size={18}
              color="rgba(255,255,255,0.92)"
              weight="regular"
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.72}
            onPress={onVideoPress}
            style={styles.actionButton}
          >
            <Icon.PhoneIcon
              size={20}
              color="rgba(255,255,255,0.92)"
              weight="regular"
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

export default GlassCardContainer;

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    paddingHorizontal: scale(10), // Reduced outer screen padding to give max room to header
    paddingTop: VerticalScale(8),
    paddingBottom: VerticalScale(12),
  },

  glassCard: {
    width: "100%",
    minHeight: VerticalScale(90),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(10), // Reduced horizontal padding inside glass card
    paddingVertical: VerticalScale(10),
    borderRadius: VerticalScale(30),
    borderWidth: 1.2,
    borderColor: "rgba(255, 255, 255, 0.25)",
    overflow: "hidden",
  },

  highlight: {
    position: "absolute",
    top: 0,
    left: scale(20),
    right: scale(20),
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
  },

  leftSection: {
    flex: 1, // Takes up all remaining room
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: VerticalScale(30),
    height: VerticalScale(40),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(2),
  },

  avatar: {
    width: VerticalScale(44),
    height: VerticalScale(44),
    borderRadius: VerticalScale(22),
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.8)",
    marginRight: scale(8),
  },

  userInfo: {
    flex: 1, // Maximizes space allocated strictly for the text
    justifyContent: "center",
  },

  userName: {
    color: "#ffffffec",
    fontWeight: "700",
    fontSize: VerticalScale(20),
    lineHeight: VerticalScale(22),
  },

  status: {
    color: "rgba(255,255,255,0.65)",
    fontWeight: "400",
    marginTop: VerticalScale(1),
    fontSize: VerticalScale(11.5),
    lineHeight: VerticalScale(14),
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    marginLeft: scale(6),
  },

  actionButton: {
    width: VerticalScale(40), // Compact action button width to save horizontal room
    height: VerticalScale(40),
    borderRadius: VerticalScale(20),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.22)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
});