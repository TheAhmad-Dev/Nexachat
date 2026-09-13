{/*
     Requests notification permission.
Gets the device push token.
Returns the token to the authentication system.
     */}
    import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import axios from "axios";

import { API_URL } from "../constants/index";

/*
 * ---------------------------------------------------------
 * FOREGROUND NOTIFICATION HANDLER
 * ---------------------------------------------------------
 *
 * This controls what happens when a notification arrives
 * while NexaChat is OPEN.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/*
 * ---------------------------------------------------------
 * REGISTER DEVICE FOR PUSH NOTIFICATIONS
 * ---------------------------------------------------------
 *
 * This function:
 *
 * 1. Checks that we are using a real physical device.
 * 2. Requests notification permission.
 * 3. Creates the Android "Messages" channel.
 * 4. Gets the Expo Push Token.
 * 5. Returns the token.
 *
 * IMPORTANT:
 *
 * This function only obtains the token.
 *
 * The token is saved to the backend separately by:
 *
 * savePushTokenToBackend()
 */
export async function registerForPushNotifications(): Promise<
  string | null
> {
  /*
   * Push notifications require a physical device.
   */
  if (!Device.isDevice) {
    console.log(
      "Push notifications require a physical device."
    );

    return null;
  }

  /*
   * Check current notification permission.
   */
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  /*
   * Ask the user if permission hasn't already been granted.
   */
  if (existingStatus !== "granted") {
    const { status } =
      await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  /*
   * Permission was denied.
   */
  if (finalStatus !== "granted") {
    console.log(
      "Notification permission was not granted."
    );

    return null;
  }

  /*
   * -------------------------------------------------------
   * ANDROID NOTIFICATION CHANNEL
   * -------------------------------------------------------
   */
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(
      "messages",
      {
        name: "Messages",

        importance:
          Notifications.AndroidImportance.MAX,

        vibrationPattern: [0, 250, 250, 250],

        sound: "default",
      }
    );
  }

  /*
   * -------------------------------------------------------
   * EXPO PROJECT ID
   * -------------------------------------------------------
   */
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    console.log(
      "Expo project ID was not found."
    );

    return null;
  }

  /*
   * -------------------------------------------------------
   * GET EXPO PUSH TOKEN
   * -------------------------------------------------------
   */
  const pushToken =
    (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;

  console.log(
    "=========================================="
  );

  console.log(
    "NEXACHAT EXPO PUSH TOKEN:"
  );

  console.log(pushToken);

  console.log(
    "=========================================="
  );

  return pushToken;
}

/*
 * ---------------------------------------------------------
 * SAVE PUSH TOKEN TO BACKEND
 * ---------------------------------------------------------
 *
 * This sends the Expo Push Token to our backend.
 *
 * The JWT tells the backend WHICH USER owns this device.
 *
 * Request:
 *
 * POST /api/notifications/push-token
 *
 * Header:
 *
 * Authorization: Bearer YOUR_JWT
 *
 * Body:
 *
 * {
 *   pushToken: "ExponentPushToken[...]"
 * }
 */
export async function savePushTokenToBackend(
  pushToken: string,
  token: string
): Promise<boolean> {
  try {
    /*
     * Send the push token to the backend.
     */
    const response = await axios.post(
      `${API_URL}/api/notifications/push-token`,
      {
        pushToken,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "Push token backend response:",
      response.data
    );

    return true;
  } catch (error) {
    /*
     * Don't crash the entire login process if saving
     * the notification token fails.
     */
    if (axios.isAxiosError(error)) {
      console.log(
        "Failed to save push token:",
        error.response?.data ?? error.message
      );
    } else {
      console.log(
        "Failed to save push token:",
        error
      );
    }

    return false;
  }
}

/*
 * ---------------------------------------------------------
 * REGISTER + SAVE TOKEN
 * ---------------------------------------------------------
 *
 * Convenience function.
 *
 * Instead of doing:
 *
 * const pushToken =
 *   await registerForPushNotifications();
 *
 * await savePushTokenToBackend(
 *   pushToken,
 *   jwt
 * );
 *
 * We can eventually call:
 *
 * await registerAndSavePushToken(jwt);
 */
export async function registerAndSavePushToken(
  token: string
): Promise<string | null> {
  /*
   * First get the Expo Push Token.
   */
  const pushToken =
    await registerForPushNotifications();

  /*
   * Permission may have been denied, or registration
   * may have failed.
   */
  if (!pushToken) {
    return null;
  }

  /*
   * Save the token in MongoDB.
   */
  await savePushTokenToBackend(
    pushToken,
    token
  );

  return pushToken;
}