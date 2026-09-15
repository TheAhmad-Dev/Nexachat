import React, { useEffect, useMemo } from "react";
import {
  Alert , 
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import * as Icon from "phosphor-react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router/react-navigation";

import { spacingX, spacingY, radius, gradientTheme, colors } from "@/constants/theme";
import { VerticalScale } from "@/utils/styling";

import Avatar from "@/components/Avatar";
import Typos from "@/components/typos";
import { useAuth } from "@/context/authcontext";

import {
  getconversation,
  newConversation,
  newMessage,
} from "@/socket/socketEvents";

import { ConversationProps, ResponseProps } from "@/types";

const ProfileDashboard = () => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { user: currentUser, signOut } = useAuth();

  const [conversations, setConversations] = React.useState<ConversationProps[]>(
    [],
  );

  const BASE_WIDTH = 390;
  const scaleRatio = width / BASE_WIDTH;

  const S = (value: number) => Math.round(value * scaleRatio);

  const cardWidth = (width - spacingX._20 * 2 - spacingX._12) / 2;

  const androidBlurMethod =
    Platform.OS === "android" ? "dimezisBlurView" : undefined;

  /*
   * ============================================================
   * CONVERSATIONS
   * ============================================================
   */

  const currentUserId = currentUser?.id || (currentUser as any)?._id;

  useEffect(() => {
    getconversation(processOfGettingConversation);
    newConversation(newConversationHandler);
    newMessage(newMessageHandler);

    return () => {
      getconversation(processOfGettingConversation, true);
      newConversation(newConversationHandler, true);
      newMessage(newMessageHandler, true);
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getconversation(null);
    }, []),
  );

  const processOfGettingConversation = (res: any) => {
    if (res?.success) {
      setConversations(res.data);
    }
  };

  const newConversationHandler = (res: ResponseProps) => {
    if (!res.success || !res.data?.isNew) return;

    setConversations((prev: any[]) => {
      const exists = prev.some(
        (conversation) => conversation._id === res.data._id,
      );

      if (exists) return prev;

      return [res.data, ...prev];
    });
  };

  const newMessageHandler = (res: ResponseProps) => {
    if (!res.success) return;

    const conversationId = res.data.conversationId;

    setConversations((prev) => {
      const exists = prev.some((item) => item._id === conversationId);

      if (!exists) {
        getconversation(null);
        return prev;
      }

      return prev.map((item) =>
        item._id === conversationId
          ? {
              ...item,
              lastMessage: res.data,
            }
          : item,
      );
    });
  };

  /*
   * ============================================================
   * DIRECT CONTACTS
   * Same logic as your Home screen
   * ============================================================
   */

  const getOtherParticipant = (item: any) => {
    return item?.participants?.find(
      (participant: any) =>
        String(participant?._id ?? participant?.id) !== String(currentUserId),
    );
  };

  const directConversation = useMemo(() => {
    return conversations
      .filter((item: ConversationProps) => item.type === "direct")
      .sort((a: ConversationProps, b: ConversationProps) => {
        const aDate = a.lastMessage?.createdAt || a.createdAt;

        const bDate = b.lastMessage?.createdAt || b.createdAt;

        return new Date(bDate).getTime() - new Date(aDate).getTime();
      });
  }, [conversations, currentUserId]);

  /*
   * This is intentionally the same horizontal contact
   * structure used on your Home screen.
   */
  const avatarRowItems = useMemo(() => {
    return directConversation.slice(0, 5).map((item: any) => {
      const other = getOtherParticipant(item);

      return {
        id: item._id,
        otherUserId: other?._id ?? other?.id ?? null,
        name: other?.name ?? "—",
        avatar: other?.avatar ?? null,
        type: item.type,
        participants: item.participants,
      };
    });
  }, [directConversation, currentUserId]);

  /*
   * ============================================================
   * OPEN CHAT
   * ============================================================
   */

  const handleAvatarPress = (item: {
    id: string;
    otherUserId: string | null;
    name: string;
    avatar: string | null;
    type: string;
    participants: any;
  }) => {
    router.push({
      pathname: "/(main)/Chatting",
      params: {
        id: item.id,
        name: item.name,
        avatar: item.avatar ?? "",
        type: item.type,
        participants: JSON.stringify(item.participants ?? []),
      },
    });
  };

  /*
   * ============================================================
   * ADD CONTACT
   * ============================================================
   */

  const handleAddContact = () => {
    router.push({
      pathname: "/(main)/NewUserConversationModel",
      params: {
        isGroup: "0",
      },
    });
  };

  /*
   * ============================================================
   * LOGOUT
   * ============================================================
   */

const handleLogout = () => {
  Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            // Optional: router.replace("/(auth)/login") if your auth context doesn't handle navigation automatically
          } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to log out");
          }
        },
      },
    ],
    {
      cancelable: true,
    }
  );
};
  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <View style={styles.container}>
      {/* VIBRANT BACKGROUND GRADIENT */}
      <LinearGradient
        colors={[
          gradientTheme.stop1,
          gradientTheme.stop2,
          gradientTheme.stop3,
          gradientTheme.stop4,
          gradientTheme.stop5,
        ]}
        locations={[0, 0.28, 0.55, 0.78, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* OVERLAY TO DEEPEN COLOR & DIM FULL-SCREEN BLUR INTENSITY */}
      <View style={styles.colorTintOverlay} />

      {/* AMBIENT GLOW */}
      <View
        pointerEvents="none"
        style={[
          styles.glowOrb,
          {
            width: S(340),
            height: S(340),
            bottom: -S(40),
            alignSelf: "center",
          },
        ]}
      />

      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: spacingX._20,
              paddingBottom: insets.bottom + S(90),
            },
          ]}
        >
          {/* ================================================== */}
          {/* HEADER */}
          {/* ================================================== */}

          <View
            style={[
              styles.header,
              {
                marginTop: spacingY._10,
              },
            ]}
          >
            <Text
              style={[
                styles.title,
                {
                  fontSize: S(24),
                },
              ]}
            >
              {currentUser?.name ?? "Profile"}
            </Text>
          </View>

          {/* ================================================== */}
          {/* AVATAR SECTION */}
          {/* ================================================== */}

          <View
            style={[
              styles.avatarSection,
              {
                height: S(200),
              },
            ]}
          >
            {/* BACK GLASS CARD 1 */}
            <View
              style={[
                styles.backGlassCardContainer,
                {
                  width: S(320),
                  height: S(125),
                  transform: [
                    {
                      rotate: "-8deg",
                    },
                  ],
                },
              ]}
            >
              <BlurView
                intensity={Platform.OS === "android" ? 8 : 12}
                tint="light"
                experimentalBlurMethod={androidBlurMethod}
                style={StyleSheet.absoluteFill}
              />
            </View>

            {/* BACK GLASS CARD 2 */}
            <View
              style={[
                styles.backGlassCardContainer,
                {
                  width: S(320),
                  height: S(125),
                  transform: [
                    {
                      rotate: "7deg",
                    },
                  ],
                },
              ]}
            >
              <BlurView
                intensity={Platform.OS === "android" ? 8 : 12}
                tint="light"
                experimentalBlurMethod={androidBlurMethod}
                style={StyleSheet.absoluteFill}
              />
            </View>

            {/* OUTER AVATAR RING */}
            <View
              style={[
                styles.avatarOuterRing,
                {
                  width: S(156),
                  height: S(156),
                  borderRadius: S(78),
                },
              ]}
            >
              {/* MIDDLE RING */}
              <View
                style={[
                  styles.avatarMiddleRing,
                  {
                    width: S(130),
                    height: S(130),
                    borderRadius: S(65),
                  },
                ]}
              >
                {/* REAL USER AVATAR */}
                <View
                  style={[
                    styles.avatarImageWrapper,
                    {
                      width: S(96),
                      height: S(96),
                      borderRadius: S(48),
                    },
                  ]}
                >
                  <Avatar
                    uri={currentUser?.avatar ?? null}
                    size={S(92)}
                    isGroup={false}
                  />
                </View>
              </View>
            </View>

            {/* PALETTE BUTTON */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.paletteButton,
                {
                  width: S(38),
                  height: S(38),
                  borderRadius: S(19),
                  right: S(105),
                  bottom: S(15),
                },
              ]}
            >
              <Icon.Palette size={S(20)} color="#0F172A" weight="fill" />
            </TouchableOpacity>
          </View>

          {/* ================================================== */}
          {/* QUICK CONTACTS */}
          {/* ================================================== */}

          <View style={[styles.glassCard, styles.quickContactsContainer]}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  fontSize: S(16),
                },
              ]}
            >
              Status & Quick Contacts
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: spacingX._15,
                paddingVertical: spacingY._5,
              }}
            >
              {/* ADD */}
              <TouchableOpacity
                style={styles.contactItem}
                activeOpacity={0.8}
                onPress={handleAddContact}
              >
                <View
                  style={[
                    styles.addCircle,
                    {
                      width: S(48),
                      height: S(48),
                      borderRadius: S(24),
                    },
                  ]}
                >
                  <Icon.Plus size={S(18)} color="#FFFFFF" weight="bold" />
                </View>

                <Text style={styles.contactName}>Add</Text>
              </TouchableOpacity>

              {/* REAL CONVERSATION CONTACTS */}
              {avatarRowItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.contactItem}
                  activeOpacity={0.8}
                  onPress={() => handleAvatarPress(item)}
                >
                  <View
                    style={[
                      styles.contactAvatarRing,
                      {
                        width: S(48),
                        height: S(48),
                        borderRadius: S(24),
                      },
                    ]}
                  >
                    <Avatar uri={item.avatar} size={S(44)} isGroup={false} />
                  </View>

                  <Text style={styles.contactName} numberOfLines={1}>
                    {item.name?.split(" ")?.[0] ?? "—"}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* ================================================== */}
          {/* ROW 1 */}
          {/* ================================================== */}

          <View style={styles.cardRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={{
                width: cardWidth,
              }}
              onPress={() => router.push("/profileModel")}
            >
              <View style={[styles.glassCard, styles.dashboardCard]}>
                <View style={styles.cardHeader}>
                  <Icon.PencilSimple
                    size={S(22)}
                    color="#FFFFFF"
                    weight="bold"
                  />

                  <View
                    style={[
                      styles.badgeGlow,
                      {
                        backgroundColor: "rgba(100, 245, 180, 0.25)",
                      },
                    ]}
                  >
                    <Icon.ChatTeardropDots
                      size={S(14)}
                      color="#e1e2e2"
                      weight="fill"
                    />
                  </View>
                </View>

                <Text style={styles.cardTitle}>Edit Info</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={{
                width: cardWidth,
                   
              }}
              onPress={() => router.push("/(main)/Aboutinfo")}
            >
              <View style={[styles.glassCard, styles.dashboardCard]}>
                <View style={styles.cardHeader}>
                  
                  <Icon.Info size={S(22)} color="#FFFFFF" weight="bold" />

                  <View
                    style={[
                      styles.badgeGlow,
                      {
                        backgroundColor: "rgba(153, 72, 245, 0.45)",
                      },
                    ]}
                  >
                    <Icon.ChatTeardropDots
                      size={S(14)}
                      color="#fdfbff"
                      weight="fill"
                    />
                  </View>
                </View>

                <Text style={styles.cardTitle}>About App </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* ================================================== */}
          {/* ROW 2 */}
          {/* ================================================== */}

          <View style={styles.cardRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={{
                width: cardWidth,
              }}
            >
              <View style={[styles.glassCard, styles.dashboardCard]}>
                <View style={styles.cardHeader}>
                  <Icon.Gear size={S(22)} color="#FFFFFF" weight="bold" />

                  <View
                    style={[
                      styles.badgeGlow,
                      {
                        backgroundColor: "rgba(100, 245, 180, 0.25)",
                      },
                    ]}
                  >
                    <Icon.ChatTeardropDots
                      size={S(14)}
                      color="#cad4d1"
                      weight="fill"
                    />
                  </View>
                </View>

                <Text style={styles.cardTitle}>App Settings</Text>
              </View>
            </TouchableOpacity>

            {/* LOGOUT */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={{
                width: cardWidth,
              }}
              onPress={handleLogout}
            >
              <View style={[styles.glassCard, styles.dashboardCard]}>
                <View style={styles.cardHeader}>
                  <Icon.SignOutIcon
                    size={S(22)}
                    color="#FFFFFF"
                    weight="bold"
                  />

                  <View
                    style={[
                      styles.badgeGlow,
                      {
                        backgroundColor: "rgba(215, 180, 255, 0.25)",
                      },
                    ]}
                  >
                    <Icon.ArrowBendUpLeft
                      size={S(16)}
                      color="#be231d"
                      weight="bold"
                    />
                  </View>
                </View>

                <Text style={styles.cardTitle}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>

      
        </ScrollView>
      </SafeAreaView>

      {/* ====================================================== */}
      {/* BOTTOM NAVIGATION */}
      {/* ====================================================== */}

      <View
        style={[
          styles.bottomBarContainer,
          {
            paddingBottom: insets.bottom > 0 ? insets.bottom : spacingY._10,

            height:
              VerticalScale(64) +
              (insets.bottom > 0 ? insets.bottom : spacingY._10),
          },
        ]}
      >
        <BlurView
          intensity={Platform.OS === "android" ? 12 : 20}
          tint="dark"
          experimentalBlurMethod={androidBlurMethod}
          style={StyleSheet.absoluteFill}
        />

        {/* HOME */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.replace("/(main)/home")}
        >
          <NavItem
            label="Home"
            icon={<Icon.House size={S(22)} color="#94A3B8" />}
          />
        </TouchableOpacity>

        {/* SEARCH */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.replace("/(main)/home")}
        >
          <NavItem
            label="Search"
            icon={<Icon.MagnifyingGlass size={S(22)} color="#94A3B8" />}
          />
        </TouchableOpacity>

        {/* PROFILE */}
        <NavItem
          label="Profile"
          active
          icon={<Icon.User size={S(22)} color="#FFFFFF" weight="fill" />}
        />

        {/* SETTINGS */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/profileDashboard")}
        >
          <NavItem
            label="Settings"
            icon={<Icon.Gear size={S(22)} color="#94A3B8" />}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* ============================================================ */
/* NAV ITEM */
/* ============================================================ */

const NavItem = ({
  label,
  icon,
  active = false,
}: {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}) => {
  return (
    <View style={styles.navItem}>
      <View style={[styles.navIconWrapper, active && styles.navIconActive]}>
        {icon}
      </View>

      <Text style={[styles.navLabel, active && styles.navLabelActive]}>
        {label}
      </Text>
    </View>
  );
};

/* ============================================================ */
/* STYLES */
/* ============================================================ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: gradientTheme.stop5,
  },


  colorTintOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
  },

  safeArea: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  glowOrb: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(145, 125, 185, 0.25)",
    opacity: 0.4,
  },

  header: {
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },

  /* AVATAR */

  avatarSection: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginVertical: spacingY._10,
  },

  backGlassCardContainer: {
    position: "absolute",
    borderRadius: radius._30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.14)",
  },

  avatarOuterRing: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.25)",
  },

  avatarMiddleRing: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },

  avatarImageWrapper: {
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  paletteButton: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
    backgroundColor: "rgba(255,255,255,0.65)",
    zIndex: 10,
  },

  /* GLASS CARD */

  glassCard: {
    borderRadius: radius._20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.30)",
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  /* CONTACTS */

  quickContactsContainer: {
    padding: spacingX._15,
    marginBottom: spacingY._12,
  },

  sectionTitle: {
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: spacingY._10,
  },

  contactItem: {
    alignItems: "center",
    gap: spacingY._5,
  },

  addCircle: {
    backgroundColor: "rgba(255,255,255,0.19)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },

  contactAvatarRing: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  contactName: {
    fontSize: 11,
    fontWeight: "500",
    color: "#FFFFFF",
  },

  /* CARDS */

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacingY._12,
  },

  dashboardCard: {
    padding: spacingX._15,
    height: VerticalScale(95),
    justifyContent: "space-between",
  },

  smallCard: {
    height: VerticalScale(60),
    justifyContent: "center",
    alignItems: "center",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  badgeGlow: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  /* BOTTOM NAV */

  bottomBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(15,23,42,0.45)",
    overflow: "hidden",
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  navIconWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  navIconActive: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  navLabel: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 2,
  },

  navLabelActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
aboutButton: {
 width: VerticalScale(38),
    height: VerticalScale(38),
    borderRadius: VerticalScale(19),
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    
},
  
});

export default ProfileDashboard;
