import {
  Alert,
  Image as RNImage,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Image } from "expo-image";
import moment from "moment";
import * as Icon from "phosphor-react-native";

import { radius } from "@/constants/theme";
import { scale, VerticalScale } from "@/utils/styling";
import { MessageProps } from "@/types";
import { useAuth } from "@/context/authcontext";

import Avatar from "./Avatar";
import Typos from "./typos";

/*
 * ============================================================
 * MessagesContent — one chat bubble
 * ============================================================
 *
 * Pure presentation: renders text / image / video according to
 * `attachmentType` and reports user intent upward. The chat
 * screen owns the fullscreen viewers and every action.
 * ============================================================
 */

interface MessagesContentProps {
  item: MessageProps;
  isDirect: boolean;
  onDeleteMessage?: (messageId: string) => void;
  onForwardMedia?: (
    mediaUrl: string,
    mediaType: "image" | "video"
  ) => void;
  onSaveToGallery?: (
    mediaUrl: string,
    mediaType: "image" | "video"
  ) => void;
  onOpenMedia?: (
    mediaUrl: string,
    mediaType: "image" | "video"
  ) => void;
}

const MessagesContent = ({
  item,
  isDirect,
  onDeleteMessage,
  onForwardMedia,
  onSaveToGallery,
  onOpenMedia,
}: MessagesContentProps) => {
  const { user: currentUser } = useAuth();

  const attachmentType: "image" | "video" =
    item.attachmentType === "video" ? "video" : "image";
  const isVideo = attachmentType === "video";

  const formattedDate = moment(item.createdAt).isSame(moment(), "day")
    ? moment(item.createdAt).format("h:mm A")
    : moment(item.createdAt).format("MMM D, h:mm A");

  const isMe = currentUser?.id === item?.sender?.id;

  // Long press handler
  const handleLongPress = () => {
    const buttons: {
      text: string;
      style?: "default" | "cancel" | "destructive";
      onPress?: () => void;
    }[] = [];

    if (item.attachment) {
      buttons.push({
        text: "Forward",
        onPress: () =>
          onForwardMedia &&
          onForwardMedia(item.attachment as string, attachmentType),
      });

      buttons.push({
        text: "Save to gallery",
        onPress: () =>
          onSaveToGallery &&
          onSaveToGallery(item.attachment as string, attachmentType),
      });
    }

    buttons.push({ text: "Cancel", style: "cancel" });
    buttons.push({
      text: "Delete",
      style: "destructive",
      onPress: () => onDeleteMessage && onDeleteMessage(item._id),
    });

    Alert.alert("Message", undefined, buttons, { cancelable: true });
  };

  return (
    <View
      style={[
        styles.messageContainer,
        isMe ? styles.myMessage : styles.theirMessage,
      ]}
    >
      {!isMe && !isDirect && (
        <Avatar
          uri={item?.sender?.avatar || null}
          size={25}
          style={styles.messageAvatar}
        />
      )}

      {/* LONG PRESS CONTAINER */}
      <Pressable
        onLongPress={handleLongPress}
        delayLongPress={300}
        style={[
          styles.messageBubble,
          isMe ? styles.myBubble : styles.theirBubble,
        ]}
      >
        {!isMe && !isDirect && (
          <Typos
            size={10}
            fontWeight="600"
            color="rgba(255,255,255,0.78)"
          >
            {item.sender?.name}
          </Typos>
        )}

        {/* ATTACHMENT */}
        {item.attachment && (
          <Pressable
            onPress={() =>
              onOpenMedia &&
              onOpenMedia(item.attachment as string, attachmentType)
            }
            onLongPress={handleLongPress}
            delayLongPress={300}
            style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
          >
            <View style={styles.attachmentWrapper}>
              {isVideo ? (
                <>
                  <RNImage
                    source={{ uri: item.attachment }}
                    style={styles.attachment}
                  />

                  <View style={styles.playOverlay} pointerEvents="none">
                    <View style={styles.playCircle}>
                      <Icon.PlayIcon
                        size={26}
                        color="#FFFFFF"
                        weight="fill"
                      />
                    </View>
                  </View>
                </>
              ) : (
                <Image
                  source={item.attachment}
                  contentFit="cover"
                  style={styles.attachment}
                  transition={100}
                />
              )}

              <TouchableOpacity
                style={styles.downloadButton}
                hitSlop={6}
                onPress={() =>
                  onSaveToGallery &&
                  onSaveToGallery(item.attachment as string, attachmentType)
                }
              >
                <Icon.DownloadSimpleIcon
                  size={17}
                  color="#FFFFFF"
                  weight="bold"
                />
              </TouchableOpacity>
            </View>
          </Pressable>
        )}

        {/* TEXT CONTENT */}
        {item.content && (
          <Typos
            color="rgba(255,255,255,0.88)"
            size={15}
            fontWeight="600"
            style={styles.messageText}
          >
            {item.content}
          </Typos>
        )}

        <Typos
          size={10}
          fontWeight="400"
          color="rgba(255,255,255,0.52)"
          style={styles.timestamp}
        >
          {formattedDate}
        </Typos>
      </Pressable>
    </View>
  );
};

export default MessagesContent;

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: scale(5),
    maxWidth: "88%",
  },
  myMessage: {
    alignSelf: "flex-end",
  },
  theirMessage: {
    alignSelf: "flex-start",
  },
  messageAvatar: {
    alignSelf: "flex-end",
    marginBottom: VerticalScale(2),
  },
  messageBubble: {
    maxWidth: "100%",
    paddingHorizontal: scale(10),
    paddingVertical: VerticalScale(7),
    borderRadius: VerticalScale(10),
    gap: VerticalScale(3),
  },
  myBubble: {
    backgroundColor: "rgba(84,79,105,0.72)",
    borderTopRightRadius: VerticalScale(4),
  },
  theirBubble: {
    backgroundColor: "rgba(90,90,98,0.42)",
    borderTopLeftRadius: VerticalScale(4),
  },
  messageText: {
    lineHeight: VerticalScale(16),
  },
  timestamp: {
    alignSelf: "flex-end",
  },
  attachment: {
    height: VerticalScale(220),
    width: scale(220),
    borderRadius: radius._10,
    marginBottom: VerticalScale(2),
  },
  attachmentWrapper: {
    position: "relative",
  },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  playCircle: {
    width: VerticalScale(48),
    height: VerticalScale(48),
    borderRadius: VerticalScale(24),
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  downloadButton: {
    position: "absolute",
    right: scale(8),
    bottom: VerticalScale(8),
    width: VerticalScale(30),
    height: VerticalScale(30),
    borderRadius: VerticalScale(15),
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
});