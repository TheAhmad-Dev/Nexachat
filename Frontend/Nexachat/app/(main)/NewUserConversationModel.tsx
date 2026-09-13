import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
   useWindowDimensions,
} from "react-native";
import { colors, gradientTheme, radius, spacingX, spacingY } from "@/constants/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Icon from "phosphor-react-native";
import BackButton from "@/components/BackButton";
import * as ImagePicker from "expo-image-picker";
import Avatar from "@/components/Avatar";
import { VerticalScale } from "@/utils/styling";
import Typos from "@/components/typos";
import { useAuth } from "@/context/authcontext";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { getcontacts, newConversation } from "@/socket/socketEvents";
import { ReadyToUploadFile } from "@/services/imageService";
import { ResponseProps } from "@/types";
import Button from "@/components/Button";

// Custom FieldShell matching Login & Register styling
const FieldShell = ({
  label,
  icon,
  rightIcon,
  ...inputProps
}: any) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ marginBottom: spacingY._15 }}>
      {label && (
        <Typos
          style={{
            fontSize: 11,
            fontWeight: "700",
            letterSpacing: 0.6,
            textTransform: "uppercase",
            color: colors.gray1,
            marginBottom: 6,
            paddingLeft: 6,
          }}
        >
          {label}
        </Typos>
      )}

      <View
        style={[
          styles.fieldShell,
          styles.shapeA,
          focused && styles.fieldShellFocused,
        ]}
      >
        {icon && <View style={styles.iconWrap}>{icon}</View>}

        <TextInput
          {...inputProps}
          style={styles.input}
          placeholderTextColor={colors.placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        {rightIcon}
      </View>
    </View>
  );
};

const NewUserConversationModel = () => {
  const { isGroup } = useLocalSearchParams();
  const isGroupModeInChat = isGroup === "1";
  const [groupAvatar, setGroupAvatar] = useState<{ uri: string } | null>(null);
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState<string[]>([]);
  const { user: currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState([]);

  const { height: screenHeight, width: screenWidth } = useWindowDimensions();



    /* ============================================================
       DEVICE ADAPTIVE VALUES
    ============================================================ */
  
    const isSmallDevice = screenHeight < 700;
  
    const isLargeDevice = screenHeight >= 820;
  
    const horizontalPadding = screenWidth < 360 ? spacingX._20 : spacingX._25;
  
    const heroHeight = isSmallDevice
      ? VerticalScale(235)
      : isLargeDevice
        ? VerticalScale(285)
        : VerticalScale(260);
  
    const avatarSize = isSmallDevice ? 125 : 145;
  
    const avatarWrapperSize = isSmallDevice ? 148 : 170;
  useEffect(() => {
    getcontacts(processGetContact);
    newConversation(processNewConversation);
    getcontacts({});
    return () => {
      getcontacts(processGetContact, true);
      newConversation(processNewConversation, true);
    };
  }, []);

  const processGetContact = (res: ResponseProps) => {
    if (res.success) {
      setContacts(res.data);
    }
  };

  const processNewConversation = (res: any) => {
    setIsLoading(false);
    if (res.success) {
      router.back();
      router.push({
        pathname: "/(main)/Chatting",
        params: {
          id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          avatar: res.data.avatar,
          type: res.data.type,
          participants: JSON.stringify(res.data.participants),
        },
      });
    } else {
      Alert.alert("Error", res.msg);
    }
  };

  const PickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setGroupAvatar(result.assets[0]);
    }
  };

  const toggleSelectedUser = (user: any) => {
    setSelectedParticipant((prev: any) => {
      if (prev.includes(user.id)) {
        return prev.filter((id: string) => id !== user.id);
      } else {
        return [...prev, user.id];
      }
    });
  };

  const createNewGroup = async () => {
    if (!isGroupModeInChat || !currentUser || selectedParticipant.length < 2) {
      return;
    }
    setIsLoading(true);
    try {
      let avatar = null;
      if (groupAvatar) {
        const UploadResults = await ReadyToUploadFile(
          groupAvatar,
          "group-avatars"
        );
        if (UploadResults.success) {
          avatar = UploadResults.data;
        }
      }
      newConversation({
        type: "group",
        participants: [currentUser.id, ...selectedParticipant],
        name: groupName,
        avatar,
      });
    } catch (error: any) {
      Alert.alert("Error", error?.msg || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSelectUser = (user: any) => {
    if (!currentUser) {
      Alert.alert("Authentication", "Please Login to start the Conversation ");
      return;
    }

    if (isGroupModeInChat) {
      toggleSelectedUser(user);
    } else {
      newConversation({
        type: "direct",
        participants: [currentUser.id, user.id],
      });
    }
  };

  return (
    <LinearGradient
      colors={[
        gradientTheme.stop1,
        gradientTheme.stop2,
        gradientTheme.ctaMid4,
        gradientTheme.stop4,
        gradientTheme.stop5,
      ]}
      locations={[0, 0.25, 0.5, 0.75, 1]}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={styles.background}
    >
      {/* 
        Using edges={['top']} keeps the status bar handled safely, 
        while letting the bottom handle custom padding so Android navigation bars don't clip content.
      */}
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        {/* HEADER */}
        <View style={styles.customHeader}>
          <BackButton onPress={() => router.back()} color={colors.light1} />
          <Typos
            fontWeight="900"
            size={20}
            color={colors.light1}
            style={styles.headerTitle}
          >
            {isGroupModeInChat ? "New Group" : "Select User"}
          </Typos>
          <View style={{ width: 40 }} />
        </View>

        {/* GROUP INFO CONTAINER */}
        {isGroupModeInChat && (
          <View style={styles.groupInfoContainer}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={PickImage} activeOpacity={0.8}>
                {/* STORY-STYLE PROFILE RING */}
                <View style={styles.profileRing}>
                  <Avatar
                    uri={groupAvatar?.uri || null}
                    isGroup={true}
                    size={115}
                  />
                </View>
                <View style={styles.editIcon}>
                  <TouchableOpacity
                                   activeOpacity={0.8}
                                   onPress={PickImage}
                                   style={[
                                     styles.avatarEdit,
                                  
                                   ]}
                                 >
                                   <LinearGradient
                                     colors={[gradientTheme.ctaMid2, gradientTheme.ctaEnd]}
                                     start={{
                                       x: 0,
                                       y: 0,
                                     }}
                                     end={{
                                       x: 1,
                                       y: 1,
                                     }}
                                     style={styles.avatarEditGradient}
                                   >
                                     <Icon.PencilSimpleIcon
                                      
                                       color={colors.light1}
                                       weight="bold"
                                     />
                                   </LinearGradient>
                                 </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.groupNameContainer}>
              <FieldShell
                placeholder="Create Group Name..."
                value={groupName}
                onChangeText={setGroupName}
                icon={<Icon.Users size={15} color={colors.bgMid} />}
              />
            </View>
          </View>
        )}

        {/* CONTACTS LIST */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.contactList,
            // Dynamic extra padding at the bottom so the last items clear the floating action button & navigation bar
            { paddingBottom: isGroupModeInChat && selectedParticipant.length >= 2 ? 120 : 40 },
          ]}
        >
          {contacts.map((user: any, index) => {
            const isSelected = selectedParticipant.includes(user.id);
            return (
              <TouchableOpacity
                key={user.id || index}
                activeOpacity={0.7}
                style={[
                  styles.contactRow,
                  isSelected && styles.selectedContact,
                ]}
                onPress={() => onSelectUser(user)}
              >
                <View style={styles.contactAvatarRing}>
                  <Avatar size={42} uri={user.avatar ? user.avatar : null} />
                </View>

                <Typos fontWeight={"700"} color={colors.white} size={15}>
                  {user.name}
                </Typos>

                {isGroupModeInChat && (
                  <View style={styles.selectionIndicator}>
                    <View
                      style={[styles.checkbox, isSelected && styles.checked]}
                    />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* CREATE GROUP BUTTON */}
        {isGroupModeInChat && selectedParticipant.length >= 2 && (
          <View style={styles.createGroupButton}>
            <Button
              onPress={createNewGroup}
              disabled={!groupName.trim()}
              loading={isLoading}
              gradientColors={[
                gradientTheme.subtext,
                gradientTheme.ctaMid1,
                gradientTheme.ctaMid2,
                gradientTheme.ctaEnd,
              ]}
              style={styles.actionButton}
            >
              <Typos fontWeight={"800"} size={16} color={colors.light1}>
                Create Group
              </Typos>
            </Button>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default NewUserConversationModel;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
  },
  customHeader: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacingX._15,
    backgroundColor: "transparent",
  },
  headerTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },

  // Group Header & Ring Style
  groupInfoContainer: {
    alignItems: "center",
    marginTop: spacingY._10,
  },
  avatarContainer: {
    marginBottom: spacingY._5,
    position: "relative",
  },
  profileRing: {
    width: 120,
    height: 120,
    borderRadius: 60, // Must be exactly half of width/height for a perfect circle
    borderWidth: 2,
    borderColor: colors.lavender,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    // iOS Shadow properties
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // Android Elevation for shadow
    elevation: 6,
  },
  editIcon: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: gradientTheme.ctaMid1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  groupNameContainer: {
    width: "88%",
    marginTop: spacingY._10,
  },

  // Field Shell Input Styles (Matched with Login/Register)
  fieldShell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.light1,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 3,
    paddingHorizontal: 12,
  },
  shapeA: {
    borderTopLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  fieldShellFocused: {
    borderColor: colors.gray1,
    backgroundColor: "#ffffff",
  },
  iconWrap: {
    width: 28,
    height: 28,
    backgroundColor: colors.light3,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 3,
    borderBottomLeftRadius: 3,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.black,
  },

  // Contact Row & Rings
  contactList: {
    gap: spacingY._10,
    marginTop: spacingY._10,
    paddingHorizontal: spacingX._15,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,
    paddingVertical: spacingY._5,
    paddingHorizontal: spacingX._12,
    borderRadius: radius._15,
  },
   avatarEdit: {
      position: "absolute",
  
      width: VerticalScale(47),
  
      height: VerticalScale(47),
  
      borderTopLeftRadius: 15,
  
      borderBottomRightRadius: 15,
  
      borderTopRightRadius: 6,
  
      borderBottomLeftRadius: 6,
  
      overflow: "hidden",
  
      borderWidth: 1,
  
      borderColor: "rgba(255,255,255,0.55)",
  
      shadowColor: colors.black,
  
      shadowOffset: {
        width: 0,
        height: 3,
      },
  
      shadowOpacity: 0.22,
  
      shadowRadius: 6,
  
      elevation: 6,
    },
  
  selectedContact: {
    backgroundColor: "rgba(255, 255, 255, 0.18)",
  },
    avatarEditGradient: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",
  },

  contactAvatarRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  selectionIndicator: {
    marginLeft: "auto",
    marginRight: spacingX._10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
  },
  checked: {
    backgroundColor: gradientTheme.ctaMid3,
    borderColor: colors.white,
  },

  // Bottom Action Button Style with safe padding for Android navigation bar / iOS home indicator
  createGroupButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacingX._20,
    // Adds platform-specific padding so Android navigation bar doesn't overlap the create button
    paddingTop: spacingY._10,
    paddingBottom: Platform.OS === "android" ? spacingY._20 + 15 : spacingY._25,
    backgroundColor: "transparent",
  },
  actionButton: {
    width: "100%",
    height: VerticalScale(50),
    borderTopLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    borderColor: colors.black,
    borderWidth: 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
    avatarFrame: {
    alignItems: "center",

    justifyContent: "center",

backgroundColor: "#F1F0F2",

    borderWidth: 2,

    borderColor: "rgba(108,110,133,0.20)",

    shadowColor: colors.black,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.15,

    shadowRadius: 10,

    elevation: 5,

    overflow: "hidden",
  },

});