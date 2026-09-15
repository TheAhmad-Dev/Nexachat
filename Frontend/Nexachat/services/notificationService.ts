// /*
//  * Notification service
//  *
//  * Expo Go:
//  *   Notifications are disabled so the app can run normally.
//  *
//  * Development build / production:
//  *   Push notification functionality is enabled.
//  */

// import * as Device from "expo-device";
// import Constants from "expo-constants";
// import { Platform } from "react-native";
// import axios from "axios";

// import { API_URL } from "../constants/index";

// /*
//  * ---------------------------------------------------------
//  * LOAD NOTIFICATIONS ONLY OUTSIDE EXPO GO
//  * ---------------------------------------------------------
//  */

// const isExpoGo =
//   Constants.appOwnership === "expo";

// let Notifications: typeof import("expo-notifications") | null =
//   null;

// if (!isExpoGo) {
//   Notifications = require("expo-notifications");
// }

// /*
//  * ---------------------------------------------------------
//  * FOREGROUND NOTIFICATION HANDLER
//  * ---------------------------------------------------------
//  */

// if (Notifications) {
//   Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//       shouldShowBanner: true,
//       shouldShowList: true,
//       shouldPlaySound: true,
//       shouldSetBadge: true,
//     }),
//   });
// }

// /*
//  * ---------------------------------------------------------
//  * REGISTER DEVICE FOR PUSH NOTIFICATIONS
//  * ---------------------------------------------------------
//  */

// export async function registerForPushNotifications(): Promise<
//   string | null
// > {
//   /*
//    * Expo Go does not support Android remote
//    * push notifications.
//    */
//   if (isExpoGo || !Notifications) {
//     console.log(
//       "Push notifications are disabled in Expo Go."
//     );

//     return null;
//   }

//   /*
//    * Push notifications require a physical device.
//    */
//   if (!Device.isDevice) {
//     console.log(
//       "Push notifications require a physical device."
//     );

//     return null;
//   }

//   /*
//    * Check current notification permission.
//    */
//   const { status: existingStatus } =
//     await Notifications.getPermissionsAsync();

//   let finalStatus = existingStatus;

//   /*
//    * Ask for permission.
//    */
//   if (existingStatus !== "granted") {
//     const { status } =
//       await Notifications.requestPermissionsAsync();

//     finalStatus = status;
//   }

//   /*
//    * Permission denied.
//    */
//   if (finalStatus !== "granted") {
//     console.log(
//       "Notification permission was not granted."
//     );

//     return null;
//   }

//   /*
//    * Android notification channel.
//    */
//   if (Platform.OS === "android") {
//     await Notifications.setNotificationChannelAsync(
//       "messages",
//       {
//         name: "Messages",
//         importance:
//           Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         sound: "default",
//       }
//     );
//   }

//   /*
//    * Expo project ID.
//    */
//   const projectId =
//     Constants.expoConfig?.extra?.eas?.projectId ??
//     Constants.easConfig?.projectId;

//   if (!projectId) {
//     console.log(
//       "Expo project ID was not found."
//     );

//     return null;
//   }

//   /*
//    * Get Expo Push Token.
//    */
//   const pushToken =
//     (
//       await Notifications.getExpoPushTokenAsync({
//         projectId,
//       })
//     ).data;

//   console.log(
//     "=========================================="
//   );

//   console.log(
//     "NEXACHAT EXPO PUSH TOKEN:"
//   );

//   console.log(pushToken);

//   console.log(
//     "=========================================="
//   );

//   return pushToken;
// }

// /*
//  * ---------------------------------------------------------
//  * SAVE PUSH TOKEN TO BACKEND
//  * ---------------------------------------------------------
//  */

// export async function savePushTokenToBackend(
//   pushToken: string,
//   token: string
// ): Promise<boolean> {
//   try {
//     const response = await axios.post(
//       `${API_URL}/api/notifications/push-token`,
//       {
//         pushToken,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     console.log(
//       "Push token backend response:",
//       response.data
//     );

//     return true;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.log(
//         "Failed to save push token:",
//         error.response?.data ?? error.message
//       );
//     } else {
//       console.log(
//         "Failed to save push token:",
//         error
//       );
//     }

//     return false;
//   }
// }

// /*
//  * ---------------------------------------------------------
//  * REGISTER + SAVE TOKEN
//  * ---------------------------------------------------------
//  */

// export async function registerAndSavePushToken(
//   token: string
// ): Promise<string | null> {
//   /*
//    * Expo Go:
//    * registerForPushNotifications() returns null,
//    * so login/signup continues normally.
//    */
//   const pushToken =
//     await registerForPushNotifications();

//   if (!pushToken) {
//     return null;
//   }

//   await savePushTokenToBackend(
//     pushToken,
//     token
//   );

//   return pushToken;
// }

/*
 * Notification service
 *
 * Expo Go:
 * Notifications are disabled.
 *
 * The rest of Nexachat continues normally.
 */

import axios from "axios";
import { API_URL } from "../constants/index";

/*
 * ---------------------------------------------------------
 * REGISTER DEVICE FOR PUSH NOTIFICATIONS
 * ---------------------------------------------------------
 */

export async function registerForPushNotifications(): Promise<
  string | null
> {
  console.log(
    "Push notifications are disabled in Expo Go."
  );

  return null;
}

/*
 * ---------------------------------------------------------
 * SAVE PUSH TOKEN TO BACKEND
 * ---------------------------------------------------------
 *
 * Kept here so the rest of the application does not
 * need to be changed later.
 */

export async function savePushTokenToBackend(
  pushToken: string,
  token: string
): Promise<boolean> {
  try {
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
 */

export async function registerAndSavePushToken(
  token: string
): Promise<string | null> {
  console.log(
    "Push notifications are disabled in Expo Go."
  );

  return null;
}