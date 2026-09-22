import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Icon from "phosphor-react-native";

// Constants
import { API_URL } from "@/constants/config";
import { colors } from "@/constants/theme";

// Components
import GlassCardContainer from "@/components/GlassCardContainer";
import MessagesContent from "@/components/messagesContent";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import Input from "@/components/Input";

// Context
import { useAuth } from "@/context/authcontext";

// Utils
import { scale, VerticalScale } from "@/utils/styling";

// Services
import { ReadyToUploadMedia } from "@/services/imageService";
import {
  pickChatImage,
  pickChatVideo,
  saveToGallery,
} from "@/services/mediaService";

// Socket
import {
  getMessages,
  newMessage,
} from "@/socket/socketEvents";

import { getSocket } from "@/socket/sockets";

// Types
import {
  MessageProps,
  ResponseProps,
} from "@/types";

// Primary chat screen managing real-time socket listeners,
// message sending, image uploading, and backend message deletion.
const Chatting = () => {
  const { user: currentUser } = useAuth();
  const insets = useSafeAreaInsets();

  const [message, setMessage] = useState("");
  const router = useRouter();

  // The single pending attachment in the composer (image or video, never both).
  const [selectedMedia, setSelectedMedia] = useState<{
    uri: string;
    type: "image" | "video";
  } | null>(null);

  // The one fullscreen media viewer — owned here, not per bubble.
  const [viewer, setViewer] = useState<{
    uri: string;
    type: "image" | "video";
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<MessageProps[]>([]);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const {
    id: conversationId,
    name,
    avatar,
    type,
    participants: stringifiedparticipants,
  } = useLocalSearchParams();

  /* =====================================================
      KEYBOARD LISTENERS
  ===================================================== */

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios"
        ? "keyboardWillShow"
        : "keyboardDidShow";

    const hideEvent =
      Platform.OS === "ios"
        ? "keyboardWillHide"
        : "keyboardDidHide";

    const keyboardShowSubscription = Keyboard.addListener(
      showEvent,
      (event) => {
        const height = event.endCoordinates?.height ?? 0;

        setKeyboardHeight(height);
        setKeyboardVisible(true);
      }
    );

    const keyboardHideSubscription = Keyboard.addListener(
      hideEvent,
      () => {
        setKeyboardHeight(0);
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardShowSubscription.remove();
      keyboardHideSubscription.remove();
    };
  }, []);

  /* =====================================================
      SOCKET SETUP
  ===================================================== */

  useEffect(() => {
    const socket = getSocket();

    if (!socket || !conversationId) {
      return;
    }

    socket.emit("joinConversation", conversationId);

    newMessage(newMessageEventHandler);

    getMessages(getNewMessagesHandler);

    getMessages({
      conversationId,
    });

    return () => {
      socket.emit("leaveConversation", conversationId);

      newMessage(newMessageEventHandler, true);

      getMessages(getNewMessagesHandler, true);
    };
  }, [conversationId]);

  /* =====================================================
      GET MESSAGES HANDLER
  ===================================================== */

  const getNewMessagesHandler = (res: ResponseProps) => {
    if (res.success) {
      setMessages(res.data);
    }
  };

  /* =====================================================
      NEW MESSAGE HANDLER
  ===================================================== */

  const newMessageEventHandler = (res: ResponseProps) => {
    setLoading(false);

    if (!res.success) {
      return;
    }

    if (res.data.conversationId === conversationId) {
      setMessages((prev) => [
        res.data as MessageProps,
        ...prev,
      ]);
    } else {
      Alert.alert(
        "Error",
        "Message belongs to another conversation."
      );
    }
  };

  /* =====================================================
      DELETE MESSAGE HANDLER
  ===================================================== */

  const handleDeleteMessage = async (messageId: string) => {
    if (!messageId) {
      Alert.alert("Error", "Invalid message ID.");
      return;
    }

    try {
      console.log(
        `Sending DELETE request to: ${API_URL}/api/messages/${messageId}`
      );

      const response = await fetch(
        `${API_URL}/api/messages/${messageId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("Delete response:", data);

      if (response.ok && data.success) {
        setMessages((prevMessages) =>
          prevMessages.filter(
            (msg) => msg._id !== messageId
          )
        );
      } else {
        Alert.alert(
          "Error",
          data.message || "Failed to delete message."
        );
      }
    } catch (error) {
      console.error(
        "Delete message fetch error:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to delete message. Please check server connection."
      );
    }
  };

  /* =====================================================
      MEDIA PICKERS (device policy lives in mediaService)
  ===================================================== */

  const pickImage = async () => {
    const uri = await pickChatImage();

    if (uri) {
      setSelectedMedia({ uri, type: "image" });
    }
  };

  const pickVideo = async () => {
    const uri = await pickChatVideo();

    if (uri) {
      setSelectedMedia({ uri, type: "video" });
    }
  };

  /* =====================================================
      PARTICIPANTS
  ===================================================== */

  let participants: any[] = [];

  try {
    if (typeof stringifiedparticipants === "string") {
      participants = JSON.parse(
        stringifiedparticipants
      );
    }
  } catch {
    participants = [];
  }

  const isDirect = type === "direct";

  let conversationOfAvatar: string | null = null;

  if (
    typeof avatar === "string" &&
    avatar.trim().length > 0
  ) {
    conversationOfAvatar = avatar;
  }

  const otherparticipants = isDirect
    ? participants.find(
        (p: any) => p?._id !== currentUser?.id
      )
    : null;

  if (isDirect && otherparticipants) {
    conversationOfAvatar =
      typeof otherparticipants.avatar === "string"
        ? otherparticipants.avatar
        : null;
  }

  const ConversationName = isDirect
    ? otherparticipants?.name ||
      name ||
      "Chat"
    : name || "Conversation";

  /* =====================================================
      SEND MESSAGE
  ===================================================== */

  const SendChat = async () => {
    if (!message.trim() && !selectedMedia) {
      return;
    }

    if (!conversationId) {
      Alert.alert(
        "Error",
        "Conversation ID is missing."
      );

      return;
    }

    setLoading(true);

    try {
      let Attachment: string | null = null;
      let AttachmentType: "image" | "video" | null = null;

      /* -----------------------------
          UPLOAD — image and video share
          one Cloudinary path
      ----------------------------- */

      if (selectedMedia) {
        const uploaded = await ReadyToUploadMedia(
          selectedMedia,
          "message-attachment",
          selectedMedia.type
        );

        if (uploaded.success) {
          Attachment = uploaded.data;
          AttachmentType = selectedMedia.type;
        } else {
          Alert.alert(
            "Upload Error",
            `Unable to upload the ${selectedMedia.type}.`
          );

          return;
        }
      }

      /* -----------------------------
          SEND MESSAGE THROUGH SOCKET
          (the backend derives the sender
          from the authenticated socket)
      ----------------------------- */

      newMessage({
        conversationId,
        content: message.trim(),
        attachment: Attachment,
        attachmentType: AttachmentType,
      });

      setMessage("");
      setSelectedMedia(null);
    } catch (error) {
      console.log(
        "Error in sending the message:",
        error
      );

      Alert.alert(
        "Error",
        "Failed to send message."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
      LAYOUT METRICS
  ===================================================== */

  const normalBottomInset = Math.max(
    insets.bottom,
    Platform.OS === "android"
      ? VerticalScale(10)
      : VerticalScale(8)
  );

  const keyboardGap = keyboardVisible
    ? VerticalScale(14)
    : 0;

  const composerBottomInset = keyboardVisible
    ? keyboardGap
    : normalBottomInset;

  const composerKeyboardOffset =
    Platform.OS === "android"
      ? keyboardHeight + keyboardGap
      : 0;

  /* =====================================================
      UI
  ===================================================== */

  return (
    <LinearGradient
      colors={[
        "rgba(110, 150, 180, 0.97)",
        "rgba(186,186,202,0.96)",
        "rgba(155,150,179,0.96)",
        "rgba(125,119,153,0.97)",
        "rgba(121,159,164,0.97)",
      ]}
      locations={[0, 0.25, 0.55, 0.78, 1]}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={styles.background}
    >
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "left", "right"]}
      >
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : undefined
          }
          keyboardVerticalOffset={
            Platform.OS === "ios" ? 14 : 0
          }
        >
          {/* =========================
              FLOATING HEADER
          ========================= */}

          <View style={styles.headerPosition}>
            <GlassCardContainer
              name={ConversationName}
              avatar={conversationOfAvatar}
              isGroup={type === "group"}
              onVideoPress={() =>
                console.log(
                  "Video call pressed"
                )
              }
              onCallPress={() =>
                console.log(
                  "Audio call pressed"
                )
              }
            />
          </View>

          {/* =========================
              CHAT CONTAINER
          ========================= */}

          <View style={styles.chatContainer}>
            <View style={styles.listContainer}>
              <FlatList
                data={messages}
                inverted
                style={styles.flatList}
                showsVerticalScrollIndicator={
                  false
                }
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode={
                  Platform.OS === "ios"
                    ? "interactive"
                    : "on-drag"
                }
                contentContainerStyle={
                  styles.messagesContent
                }
                renderItem={({ item }) => (
                  <MessagesContent
                    item={item}
                    isDirect={isDirect}
                    onDeleteMessage={
                      handleDeleteMessage
                    }
                    onOpenMedia={(mediaUrl, mediaType) =>
                      setViewer({ uri: mediaUrl, type: mediaType })
                    }
                    onForwardMedia={(mediaUrl, mediaType) =>
                      router.push({
                        // @ts-expect-error runtime string route; typed-routes
                        // registry regenerates on the next `expo start`
                        pathname: "/(main)/ForwardPicker",
                        params: {
                          mediaUrl,
                          mediaType,
                        },
                      })
                    }
                    onSaveToGallery={saveToGallery}
                  />
                )}
                keyExtractor={(
                  item,
                  index
                ) =>
                  item._id ??
                  `message-${index}`
                }
              />
            </View>

            {/* =========================
                FULLSCREEN MEDIA VIEWER
                (one instance serves every bubble)
            ========================= */}

            <VideoPlayerModal
              source={viewer?.type === "video" ? viewer.uri : null}
              onClose={() => setViewer(null)}
            />

            <Modal
              visible={viewer?.type === "image"}
              transparent
              animationType="fade"
              onRequestClose={() => setViewer(null)}
            >
              <View style={styles.viewerBackground}>
                <TouchableOpacity
                  style={styles.viewerBackdrop}
                  activeOpacity={1}
                  onPress={() => setViewer(null)}
                >
                  <View style={styles.imageCardWrapper}>
                    <TouchableOpacity
                      style={styles.viewerCloseButton}
                      onPress={() => setViewer(null)}
                      hitSlop={10}
                    >
                      <Icon.XIcon size={20} color="#FFFFFF" weight="bold" />
                    </TouchableOpacity>

                    <Image
                      source={
                        viewer?.type === "image"
                          ? { uri: viewer.uri }
                          : undefined
                      }
                      resizeMode="cover"
                      style={styles.fullScreenImage}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </Modal>

            {/* =========================
                COMPOSER
            ========================= */}

            <View
              style={[
                styles.footer,
                {
                  paddingBottom:
                    composerBottomInset,

                  transform: [
                    {
                      translateY:
                        -composerKeyboardOffset,
                    },
                  ],
                },
              ]}
            >
              <View
                style={
                  styles.composerWrapper
                }
              >
                <Input
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Your Message..."
                  containerStyle={
                    styles.inputContainer
                  }
                  inputStyle={
                    styles.inputText
                  }
                  multiline
                  icon={
                    <TouchableOpacity
                      onPress={
                        selectedMedia?.type === "video"
                          ? pickVideo
                          : pickImage
                      }
                      activeOpacity={0.7}
                      style={styles.attachButton}
                    >
                      {selectedMedia?.type === "image" ? (
                        <Image
                          source={{ uri: selectedMedia.uri }}
                          style={styles.selectedFile}
                        />
                      ) : selectedMedia?.type === "video" ? (
                        <View
                          style={
                            styles.selectedVideoBadge
                          }
                        >
                          <Icon.VideoCameraIcon
                            size={17}
                            color="#FFFFFF"
                            weight="fill"
                          />
                        </View>
                      ) : (
                        <Icon.PlusIcon
                          size={19}
                          color="rgba(255,255,255,0.70)"
                          weight="regular"
                        />
                      )}
                    </TouchableOpacity>
                  }
                />

                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    message.length > 0 && {
                      backgroundColor:
                        colors.sendButtonbg,
                    },
                  ]}
                  onPress={SendChat}
                >
                  <Icon.PaperPlaneTiltIcon
                    size={VerticalScale(22)}
                    color={
                      message.length > 0
                        ? colors.black
                        : colors.white
                    }
                    weight={
                      message.length > 0
                        ? "fill"
                        : "regular"
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Chatting;

/* =====================================================
    STYLES
===================================================== */

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
  },

  safeArea: {
    flex: 1,
  },

  keyboardContainer: {
    flex: 1,
    minHeight: 0,
  },

  headerPosition: {
    width: "100%",
    paddingHorizontal: scale(10),
    paddingTop: VerticalScale(4),
    paddingBottom: VerticalScale(6),
    zIndex: 20,
    backgroundColor: "transparent",
    flexShrink: 0,
  },

  chatContainer: {
    flex: 1,
    minHeight: 0,
    width: "100%",
    backgroundColor: "transparent",
  },

  listContainer: {
    flex: 1,
    minHeight: 0,
    width: "100%",
  },

  flatList: {
    flex: 1,
  },

  messagesContent: {
    paddingHorizontal: scale(14),
    paddingTop: VerticalScale(8),
    paddingBottom: VerticalScale(12),
    gap: VerticalScale(8),
  },

  footer: {
    width: "100%",
    paddingHorizontal: scale(14),
    paddingTop: VerticalScale(6),
    backgroundColor: "transparent",
    flexShrink: 0,
    position: "relative",
  },

  composerWrapper: {
    width: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },

  inputContainer: {
    minHeight: VerticalScale(54),
    maxHeight: VerticalScale(110),
    width: "100%",
    marginTop: 0,
    paddingLeft: scale(13),
    paddingRight: scale(58),
    backgroundColor:
      "rgba(8,8,11,0.94)",
    borderWidth: 0.95,
    borderColor:
      "rgba(255,255,255,0.16)",
    borderRadius: VerticalScale(28),
    gap: scale(8),
    justifyContent: "center",
  },

  inputText: {
    color: "#FFFFFF",
    fontSize: VerticalScale(14),
    paddingVertical: VerticalScale(6),
    textAlignVertical: "top",
    includeFontPadding: false,
  },

  attachButton: {
    width: VerticalScale(34),
    height: VerticalScale(34),
    justifyContent: "center",
    alignItems: "center",
  },

  selectedFile: {
    width: VerticalScale(34),
    height: VerticalScale(34),
    borderRadius: VerticalScale(17),
  },

  selectedVideoBadge: {
    width: VerticalScale(34),
    height: VerticalScale(34),
    borderRadius: VerticalScale(17),
    backgroundColor: "rgba(68,68,74,0.96)",
    justifyContent: "center",
    alignItems: "center",
  },

  viewerBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "center",
    alignItems: "center",
  },

  viewerBackdrop: {
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

  viewerCloseButton: {
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

  sendButton: {
    position: "absolute",
    right: scale(6),
    alignSelf: "center",
    width: VerticalScale(42),
    height: VerticalScale(42),
    borderRadius: VerticalScale(21),
    backgroundColor:
      "rgba(68,68,74,0.96)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.12)",
  },
});


























