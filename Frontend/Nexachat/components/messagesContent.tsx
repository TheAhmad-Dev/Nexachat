import { Alert, Modal, Pressable, StyleSheet, View } from "react-native";
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

// Renders chat message bubbles, handles media modal previews, and exposes a long-press action for deletion
const MessagesContent = ({
  item,
  isDirect,
  onDeleteMessage, // Function passed from parent component
}: {
  item: MessageProps;
  isDirect: boolean;
  onDeleteMessage?: (messageId: string) => void;
}) => {
  const { user: currentUser } = useAuth();
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  const formattedDate = moment(item.createdAt).isSame(moment(), "day")
    ? moment(item.createdAt).format("h:mm A")
    : moment(item.createdAt).format("MMM D, h:mm A");

  const isMe = currentUser?.id === item?.sender?.id;

  const handleImageOpen = () => setImageViewerVisible(true);
  const handleImageClose = () => setImageViewerVisible(false);

  // Long press handler
  const handleLongPress = () => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDeleteMessage && onDeleteMessage(item._id),
        },
      ],
      { cancelable: true }
    );
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
              onPress={handleImageOpen}
              onLongPress={handleLongPress}
              delayLongPress={300}
              style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
            >
              <Image
                source={item.attachment}
                contentFit="cover"
                style={styles.attachment}
                transition={100}
              />
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