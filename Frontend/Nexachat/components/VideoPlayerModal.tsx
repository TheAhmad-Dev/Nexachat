import React, { useEffect } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import * as Icon from "phosphor-react-native";

import { scale, VerticalScale } from "@/utils/styling";

/*
 * ============================================================
 * VideoPlayerModal — WhatsApp-style fullscreen video viewer
 * ============================================================
 *
 * Renders `source` with native controls, plays on open, and
 * closes on the X button or a backdrop tap.
 * ============================================================
 */

interface VideoPlayerModalProps {
  source: string | null;
  onClose: () => void;
}

const VideoPlayerModal = ({ source, onClose }: VideoPlayerModalProps) => {
  // expo-video accepts `null` as an "empty" source.
  const player = useVideoPlayer((source ?? null) as any, (player) => {
    player.loop = false;
  });

  // New source (or reopen) -> play from the start.
  useEffect(() => {
    if (!source) {
      return;
    }

    player.play();
  }, [source, player]);

  return (
    <Modal
      visible={source !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <Pressable style={styles.backdrop} onPress={onClose}>
          <View />
        </Pressable>

        {source && (
          <View style={styles.playerCard}>
            <Pressable
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={10}
            >
              <Icon.XIcon size={20} color="#FFFFFF" weight="bold" />
            </Pressable>

            <VideoView
              player={player}
              style={styles.video}
              contentFit="contain"
              nativeControls
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.92)",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  playerCard: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: VerticalScale(45),
    right: scale(16),
    zIndex: 10,
    padding: scale(8),
    borderRadius: VerticalScale(18),
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  video: {
    width: "100%",
    height: "80%",
  },
});

export default VideoPlayerModal;
