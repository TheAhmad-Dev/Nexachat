// // import { Platform } from "react-native";

// //   export const API_URL = Platform.OS == "android"? "http://192.168.1.3:3000"  : "http://localhost:3000/";

// // export const API_URL =
// //   Platform.OS === "android"
// //     ? "http://192.168.1.13:3000"
// //     : "http://localhost:3000";
// import { Platform } from "react-native";

// export const API_URL =
//   Platform.OS === "android"
//       ? "http://192.168.1.9:3000"
//     : "http://localhost:3000";

    
//     export const CLOUDINARY_CLOUD_NAME= "yv7ffnux";
//     export const CLOUDINARY_UPLOAD_PRESET ="Nexachat" 
   


export const API_URL = process.env.EXPO_PUBLIC_API_URL!;

export const CLOUDINARY_CLOUD_NAME = "yv7ffnux";
export const CLOUDINARY_UPLOAD_PRESET = "Nexachat";