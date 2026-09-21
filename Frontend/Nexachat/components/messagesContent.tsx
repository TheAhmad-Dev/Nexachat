import {
  Alert,
  Image as RNImage,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import moment from "moment";
import * as Icon from "phosphor-react-native";

import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, VerticalScale } from "@/utils/styling";
import { MessageProps } from "@/types";
import { useAuth } from "@/context/authcontext";

import Avatar from "./Avatar";
import Typos from "./typos";
import VideoPlayerModal from "./VideoPlayerModal";

// Renders chat message bubbles, handles media modal previews, and exposes a long-press action for deletion
const MessagesContent = ({
  item,
  isDirect,
  onDeleteMessage, // Function passed from parent component
  onForwardMedia,
  onSaveToGallery,
}: {
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
}) => {
  const { user: currentUser } = useAuth();
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [videoViewerVisible, setVideoViewerVisible] = useState(false);

  const attachmentType: "image" | "video" =
    item.attachmentType === "video" ? "video" : "image";
  const isVideo = attachmentType === "video";

  const formattedDate = moment(item.createdAt).isSame(moment(), "day")
    ? moment(item.createdAt).format("h:mm A")
    : moment(item.createdAt).format("MMM D, h:mm A");

  const isMe = currentUser?.id === item?.sender?.id;

  const handleImageOpen = () => setImageViewerVisible(true);
  const handleImageClose = () => setImageViewerVisible(false);
  const handleVideoOpen = () => setVideoViewerVisible(true);
  const handleVideoClose = () => setVideoViewerVisible(false);

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
          <>
            <Pressable
              onPress={isVideo ? handleVideoOpen : handleImageOpen}
              onLongPress={handleLongPress}
              delayLongPress={300}
              style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
            >
              {isVideo ? (
                <View style={styles.videoThumbWrapper}>
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

                  <TouchableOpacity
                    style={styles.downloadButton}
                    hitSlop={6}
                    onPress={() =>
                      onSaveToGallery &&
                      onSaveToGallery(
                        item.attachment as string,
                        "video"
                      )
                    }
                  >
                    <Icon.DownloadSimpleIcon
                      size={17}
                      color="#FFFFFF"
                      weight="bold"
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.videoThumbWrapper}>
                  <Image
                    source={item.attachment}
                    contentFit="cover"
                    style={styles.attachment}
                    transition={100}
                  />

                  <TouchableOpacity
                    style={styles.downloadButton}
                    hitSlop={6}
                    onPress={() =>
                      onSaveToGallery &&
                      onSaveToGallery(
                        item.attachment as string,
                        "image"
                      )
                    }
                  >
                    <Icon.DownloadSimpleIcon
                      size={17}
                      color="#FFFFFF"
                      weight="bold"
                    />
                  </TouchableOpacity>
                </View>
              )}
            </Pressable>

            <Modal
              visible={imageViewerVisible}
              transparent
              animationType="fade"
              onRequestClose={handleImageClose}
            >
              <View style={styles.modalBackground}>
                <Pressable
                  style={styles.modalBackdropClose}
                  onPress={handleImageClose}
                >
                  <View style={styles.imageCardWrapper}>
                    <Pressable
                      style={styles.closeButton}
                      onPress={handleImageClose}
                      hitSlop={10}
                    >
                      <Icon.XIcon size={20} color="#FFFFFF" weight="bold" />
                    </Pressable>

                    <Image
                      source={item.attachment}
                      contentFit="cover"
                      style={styles.fullScreenImage}
                    />
                  </View>
                </Pressable>
              </View>
            </Modal>

            <VideoPlayerModal
              source={isVideo ? item.attachment : null}
              onClose={handleVideoClose}
            />
          </>
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
  videoThumbWrapper: {
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
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackdropClose: {
    flex: 1,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: scale(17),
  },
  imageCardWrapper: {
    width: "100%",
    maxHeight: "90%",
    borderRadius: VerticalScale(20),
    overflow: "hidden",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: VerticalScale(12),
    right: scale(12),
    zIndex: 10,
    padding: scale(6),
    borderRadius: VerticalScale(16),
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
    minHeight: VerticalScale(320),
  },
});