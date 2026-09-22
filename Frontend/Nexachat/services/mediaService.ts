import * as MediaLibrary from "expo-media-library";
import { File, Paths } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { ResponseProps } from "@/types";

/*
 * ============================================================
 * mediaService — on-device media capabilities for chat
 * ============================================================
 *
 * The single owner of everything that touches the device:
 *   - pickChatImage() / pickChatVideo(): gallery pickers
 *   - saveToGallery(url): downloads a remote image/video and
 *     saves it into the device gallery
 * ============================================================
 */

/** One permission + launch + error policy for every picker. */
const openGalleryPicker = async (
  options: ImagePicker.ImagePickerOptions
): Promise<string | null> => {
  try {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Permission to access your gallery is required."
      );

      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled && result.assets.length > 0) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.log("Gallery picker error:", error);

    Alert.alert("Error", "Unable to open your gallery.");

    return null;
  }
};

/** Opens the gallery and returns the picked image asset, or null. */
export const pickChatImage = (): Promise<string | null> =>
  openGalleryPicker({
    mediaTypes: ["images"],
    aspect: [1, 1],
    quality: 1,
  });

/** Opens the gallery and returns the picked video asset, or null. */
export const pickChatVideo = (): Promise<string | null> =>
  openGalleryPicker({
    mediaTypes: ["videos"],
    quality: 1,
  });

/** Writes a remote media URL to a local cache file and returns its path. */
const downloadToFile = async (
  url: string,
  extension: string
): Promise<string | null> => {
  try {
    const file = new File(Paths.cache, `nexachat-${Date.now()}.${extension}`);

    const saved = await File.downloadFileAsync(url, file);

    return saved.uri;
  } catch (error) {
    console.log("Download failed:", error);

    return null;
  }
};

const extensionFromUrl = (url: string): string => {
  const match = url.split("?")[0].match(/\.([a-zA-Z0-9]{2,5})$/);

  return match ? match[1].toLowerCase() : "";
};

/**
 * Downloads a remote image/video into the device gallery.
 * Returns the MediaLibrary asset when it succeeded.
 */
export const saveToGallery = async (
  url: string,
  mediaType: "image" | "video"
): Promise<ResponseProps> => {
  try {
    const permission = await MediaLibrary.requestPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Permission to save to your gallery is required."
      );

      return { success: false, msg: "Permission denied" };
    }

    const fallback = mediaType === "video" ? "mp4" : "jpg";
    const extension = extensionFromUrl(url) || fallback;
    const localUri = await downloadToFile(url, extension);

    if (!localUri) {
      Alert.alert("Error", "Could not download the file.");

      return { success: false, msg: "Download failed" };
    }

    const asset = await MediaLibrary.createAssetAsync(localUri);

    Alert.alert("Saved", "Saved to your gallery.");

    return { success: true, data: asset };
  } catch (error: any) {
    console.log("Save to gallery failed:", error.message);

    Alert.alert("Error", "Could not save to the gallery.");

    return { success: false, msg: error.message };
  }
};
