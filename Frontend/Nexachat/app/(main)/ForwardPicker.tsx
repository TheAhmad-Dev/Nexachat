import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import * as Icon from "phosphor-react-native";

import Typos from "@/components/typos";
import Avatar from "@/components/Avatar";
import {
  colors,
  gradientTheme,
  radius,
  spacingX,
  spacingY,
} from "@/constants/theme";
import { VerticalScale } from "@/utils/styling";
import {
  ConversationProps,
  ResponseProps,
} from "@/types";
import {
  getconversation,
} from "@/socket/socketEvents";
import { useAuth } from "@/context/authcontext";
import { getSocket } from "@/socket/sockets";

/*
 * ============================================================
 * ForwardPicker — pick destination chats for a forward
 * ============================================================
 *
 * Receives the media URL + type through route params, renders
 * ONE flat list of every conversation the user is in (DMs and
 * groups together, like WhatsApp), and calls the onForward
 * handler for the picked one. All conversations get the SAME
 * treatment — no direct/group branching anywhere.
 * ============================================================
 */

const ForwardPicker = () => {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { mediaUrl, mediaType } =
    useLocalSearchParams<{ mediaUrl: string; mediaType: string }>();

  const [conversations, setConversations] = useState<
    ConversationProps[]
  >([]);
  const [forwardingTo, setForwardingTo] = useState<string | null>(null);

  // Refresh the list every time the modal opens.
  useFocusEffect(
    useCallback(() => {
      getconversation(processConversations);
      getconversation(null);

      return () => {
        getconversation(processConversations, true);
      };
    }, [])
  );

  const processConversations = (res: ResponseProps) => {
    if (res.success) {
      setConversations(res.data);
    }
  };

  const handleForward = async (conversationId: string) => {
    if (!currentUser || forwardingTo) {
      return;
    }

    setForwardingTo(conversationId);

    try {
      const socket = getSocket();

      if (!socket?.connected) {
        throw new Error("Socket is not connected");
      }

      // Direct emission: one event, the conversation's room
      // broadcast comes back through each chat's newMessage
      // handler (including the one that is currently open).
      socket.emit("newMessage", {
        conversationId,
        content: "",
        attachment: mediaUrl,
        attachmentType: mediaType,
      });
    } catch (error: any) {
      console.log("Forward failed:", error.message);

      Alert.alert("Error", "Could not forward the media.");
    } finally {
      setForwardingTo(null);
      router.back();
    }
  };

  const renderRow = ({ item }: { item: ConversationProps }) => {
    const other =
      item.type === "direct"
        ? item.participants?.find(
            (p) =>
              String(p._id) !==
              String(currentUser?.id)
          )
        : null;

    const displayName =
      item.type === "direct"
        ? other?.name || "Direct chat"
        : item.name || "Group";

    const rowAvatar =
      item.type === "direct" ? other?.avatar ?? null : item.avatar ?? null;

    return (
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.7}
        disabled={forwardingTo !== null}
        onPress={() => handleForward(item._id)}
      >
        <Avatar uri={rowAvatar ?? null} size={44} isGroup={item.type === "group"} />

        <View style={styles.rowText}>
          <Typos size={15} fontWeight="600">
            {displayName}
          </Typos>
        </View>

        {forwardingTo === item._id && (
          <Icon.CircleNotch
            size={20}
            color={gradientTheme.ctaMid2}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <Stack.Screen
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />

      <LinearGradient
        colors={[
          gradientTheme.stop1,
          gradientTheme.stop2,
          gradientTheme.stop3,
          gradientTheme.stop4,
          gradientTheme.stop5,
        ]}
        start={{ x: 0.05, y: 0 }}
        end={{ x: 0.95, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={styles.closeButton}
          >
            <Icon.XIcon size={21} color={colors.light1} weight="bold" />
          </TouchableOpacity>

          <View style={styles.pageTitleBox}>
            <Typos style={styles.pageTitle}>Forward to</Typos>
          </View>

          <View style={styles.closeButton} />
        </View>

        <Typos style={styles.heroTitle}>
          Choose a chat
        </Typos>
      </LinearGradient>

      <View style={styles.mainArea}>
        <FlatList
          data={conversations}
          keyExtractor={(item) => item._id}
          renderItem={renderRow}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Typos
              size={14}
              color={colors.textGray}
              style={styles.emptyText}
            >
              No conversations yet
            </Typos>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.ivoryWhite,
  },
  hero: {
    height: VerticalScale(150),
    paddingHorizontal: spacingX._25,
    paddingTop: VerticalScale(50),
    justifyContent: "flex-end",
    paddingBottom: spacingY._20,
    overflow: "hidden",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  pageTitleBox: {
    flex: 1,
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.light1,
  },
  closeButton: {
    width: 42,
    height: 42,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.light1,
  },
  mainArea: {
    flex: 1,
    marginTop: -24,
    borderTopLeftRadius: radius._40,
    borderTopRightRadius: radius._40,
    backgroundColor: colors.ivoryWhite,
    overflow: "hidden",
  },
  listContent: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,
    paddingVertical: spacingY._10,
  },
  rowText: {
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: spacingY._30,
  },
});

export default ForwardPicker;
