// import {
//   ActivityIndicator,
//   Alert,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import Typos from "@/components/typos";
// import { colors, radius, spacingX, spacingY } from "@/constants/theme";
// import ScreenWrapper from "@/components/ScreenWrapper";
// import Header from "@/components/Header";
// import BackButton from "@/components/BackButton";
// import { VerticalScale } from "@/utils/styling";
// import Avatar from "@/components/Avatar";
// import * as Icon from "phosphor-react-native";
// import Input from "@/components/Input";
// import { useAuth } from "@/context/authcontext";
// import { UserDataProps } from "@/types";
// import Button from "@/components/Button";
// import { useRouter } from "expo-router";
// import { UpdatedProfile } from "@/socket/socketEvents";
// import * as ImagePicker from "expo-image-picker";
// import { ReadyToUploadFile } from "@/services/imageService";

// const ProfileModel = () => {
//   const { user, signOut, updateToken } = useAuth();
//   const router = useRouter();
//   const [loading, setisLoading] = useState(false);
//   const [userData, setUserData] = useState<UserDataProps>({
//     name: "",
//     email: "",
//     avatar: user?.avatar || null,
//   });
//   const OnSubmit = async () => {
//     const { name, avatar } = userData;

//     if (!name.trim()) {
//       Alert.alert("User", "Please Enter name first");
//       return;
//     }

//     const data = {
//       name,
//       avatar,
//     };

//     if (avatar && typeof avatar !== "string") {
//       setisLoading(true);
//       const res = await ReadyToUploadFile(avatar, "profiles");
//       if (res.success) {
//         data.avatar = res.data;
//       } else {
//         console.log("User", res.msg);
//         setisLoading(false);
//         return;
//       }
//     }

//     console.log("Sending:", data);
//     UpdatedProfile(data);

//     console.log("data", data);
//     return;
//   };

//   const ProcessOfProfileUpdating = (Res: any) => {
//     console.log("Got Response", Res);

//     setisLoading(false);

//     if (Res.success) {
//       updateToken(Res.data.token);

//       router.back();
//     } else {
//       Alert.alert("User", Res.msg);
//     }
//   };

//   useEffect(() => {
//     setUserData({
//       name: user?.name || "",
//       email: user?.email || "",
//       avatar: user?.avatar || null,
//     });
//   }, [user]);

//   useEffect(() => {
//     UpdatedProfile(ProcessOfProfileUpdating);
//     return () => {
//       UpdatedProfile(ProcessOfProfileUpdating, true);
//     };
//   }, []);

//   const PickImage = async () => {
//     // Ask for permission
//     const permissionResult =
//       await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (!permissionResult.granted) {
//       alert("Permission to access gallery is required!");
//       return;
//     }

//     // Open gallery
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ["images"],
//       // allowsEditing: true,
//       aspect: [1, 1],
//       quality: 1,
//     });
//     console.log(result);
//     if (!result.canceled) {
//       setUserData({ ...userData, avatar: result.assets[0] });
//     }
//   };

//   const handleLogout = async () => {
//     router.back();
//     await signOut();
//   };

//   const showConfirmationNotification = () => {
//     Alert.alert("Confirmation", "Are you sure to want to Logout ?", [
//       {
//         text: "Cancel",
//         onPress: () => console.log("cancel Logout "),
//         style: "cancel",
//       },
//       {
//         text: "Logout",
//         onPress: () => handleLogout(),
//         style: "destructive",
//       },
//     ]);
//   };

//   return (
//     <ScreenWrapper isModal={true} showPattren={true}>
//       <View style={styles.container}>
//         <View style={styles.content}>
//           <View style={{ flex: 1 }}>
//             <Header
//               title="Update Profile"
//               showBackButton={false}
//               rightElement={undefined}
//               leftIcon={
//                 Platform.OS == "android" && (
//                   <BackButton color={colors.neutral900} />
//                 )
//               }
//             />
//             <ScrollView contentContainerStyle={styles.form}>
//               <View style={styles.avatarContainer}>
//                 <Avatar
//                   uri={
//                     typeof userData.avatar === "string"
//                       ? userData.avatar
//                       : (userData.avatar?.uri ?? user?.avatar ?? null)
//                   }
//                   size={200}
//                 />
//                 <TouchableOpacity style={styles.editIcon} onPress={PickImage}>
//                   <Icon.PencilIcon
//                     color={colors.deepGold}
//                     size={VerticalScale(25)}
//                   />
//                 </TouchableOpacity>
//               </View>
//               <View style={{ gap: spacingY._5 }}>
//                 <View style={styles.inputContainer}>
//                   <Typos
//                     style={{ paddingLeft: spacingX._10 }}
//                     fontWeight="bold"
//                     size={20}
//                   >
//                     Email
//                   </Typos>
//                   <Input
//                     containerStyle={{
//                       paddingLeft: spacingX._15,
//                       backgroundColor: colors.neutral350,
//                       borderColor: colors.neutral350,
//                     }}
//                     value={userData.email}
//                     onChangeText={(value) => {
//                       setUserData({ ...userData, email: value });
//                     }}
//                     editable={false}
//                   />
//                 </View>
//                 <View style={styles.inputContainer}>
//                   <Typos
//                     style={{ paddingLeft: spacingX._10 }}
//                     fontWeight="bold"
//                     size={20}
//                   >
//                     Name
//                   </Typos>
//                   <Input
//                     containerStyle={{
//                       borderColor: colors.neutral350,
//                       paddingLeft: spacingX._15,
//                     }}
//                     value={userData.name}
//                     onChangeText={(value) => {
//                       setUserData({ ...userData, name: value });
//                     }}
//                     editable={true}
//                   />
//                 </View>
//               </View>
//             </ScrollView>
//             <View style={styles.footer}>
//               {loading ? (
//                 <ActivityIndicator size="large" color={colors.deepGold} />
//               ) : (
//                 <>
//                   <Button
//                     onPress={showConfirmationNotification}
//                     style={{
//                       height: VerticalScale(56),
//                       width: VerticalScale(56),
//                       backgroundColor: colors.rose,
//                     }}
//                   >
//                     <Icon.SignOutIcon
//                       style={{ marginLeft: 12 }}
//                       weight="bold"
//                       size={VerticalScale(30)}
//                       color={colors.white}
//                     />
//                   </Button>
//                   <Button
//                     onPress={OnSubmit}
//                     loading={loading}
//                     style={{
//                       backgroundColor: colors.myBubble,
//                       width: 230,
//                       height: VerticalScale(56),
//                       borderRadius: 16,
//                       borderColor: colors.neutral500,
//                       borderWidth: 1.5,
//                       justifyContent: "center",
//                       alignItems: "center",
//                     }}
//                   >
//                     <Typos color={colors.black} size={22} fontWeight={"bold"}>
//                       Update
//                     </Typos>
//                   </Button>
//                 </>
//               )}
//             </View>
//           </View>
//         </View>
//       </View>

//     </ScreenWrapper>
//   );
// };

// export default ProfileModel;
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "space-between",
//   },

//   header: {
//     paddingHorizontal: spacingX._20,
//     paddingTop: spacingY._5,
//     paddingBottom: spacingY._40,
//     justifyContent: "space-between",
//     alignItems: "center",
//     flexDirection: "row",
//   },

//   content: {
//     flex: 1,
//     backgroundColor: colors.white,
//     borderTopLeftRadius: radius._50,
//     borderTopRightRadius: radius._50,
//     borderCurve: "continuous",
//     paddingHorizontal: spacingX._20,
//     paddingTop: spacingY._10,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: -3,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5,
//   },

//   form: {
//     marginTop: spacingY._20,
//     gap: spacingY._20,
//   },

//   avatarContainer: {
//     position: "relative",
//     alignSelf: "center",
//     marginBottom: spacingY._20,
//   },

//   avatar: {
//     alignSelf: "center",
//     backgroundColor: colors.neutral300,
//     width: VerticalScale(135),
//     height: VerticalScale(135),
//     borderRadius: VerticalScale(67.5),
//     borderWidth: 1,
//     borderColor: colors.neutral500,
//     overflow: "hidden",
//   },

//   editIcon: {
//     position: "absolute",
//     bottom: spacingY._5,
//     right: spacingY._7,
//     borderRadius: 100,
//     backgroundColor: colors.neutral100,
//     shadowColor: colors.black,
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.5,
//     shadowRadius: 10,
//     elevation: 5,
//     padding: spacingY._7,
//   },

//   inputContainer: {
//     gap: spacingY._7,
//   },

//   footer: {
//     gap: 15,
//     justifyContent: "center",
//     alignItems: "center",
//     flexDirection: "row",
//     paddingTop: spacingY._20,
//     paddingBottom: spacingY._20,
//     borderTopWidth: 1,
//     borderTopColor: colors.neutral200,
//     marginBottom: spacingY._10,
//   },
// });







import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Icon from "phosphor-react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
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
import { useAuth } from "@/context/authcontext";
import { UserDataProps } from "@/types";
import { UpdatedProfile } from "@/socket/socketEvents";
import { ReadyToUploadFile } from "@/services/imageService";

/* ============================================================
   PROFILE FIELD
============================================================ */

const ProfileField = ({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  disabled = false,
  rightElement,
  keyboardType,
  autoCapitalize,
}: any) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldBlock}>
      <View style={styles.fieldLabelRow}>
        <Typos style={styles.fieldLabel}>{label}</Typos>

        {disabled && (
          <View style={styles.readOnlyLabel}>
            <Icon.LockSimpleIcon size={11} color={colors.gray1} weight="bold" />

            <Typos style={styles.readOnlyText}>Read only</Typos>
          </View>
        )}
      </View>

      <View
        style={[
          styles.inputBox,
          focused && !disabled && styles.inputBoxFocused,
          disabled && styles.inputBoxDisabled,
        ]}
      >
        <View style={[styles.inputIcon, disabled && styles.inputIconDisabled]}>
          {icon}
        </View>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          editable={!disabled}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={[styles.textInput, disabled && styles.disabledText]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        {rightElement}
      </View>
    </View>
  );
};

/* ============================================================
   SCREEN
============================================================ */

const ProfileModel = () => {
  const { user, signOut, updateToken } = useAuth();

  const router = useRouter();

  const insets = useSafeAreaInsets();

  const { height: screenHeight, width: screenWidth } = useWindowDimensions();

  const [loading, setIsLoading] = useState(false);

  const [userData, setUserData] = useState<UserDataProps>({
    name: "",
    email: "",
    avatar: user?.avatar || null,
  });

  /* ============================================================
     DEVICE ADAPTIVE VALUES
  ============================================================ */

  const isSmallDevice = screenHeight < 700;

  const isLargeDevice = screenHeight >= 820;

  const horizontalPadding = screenWidth < 360 ? spacingX._20 : spacingX._25;

  const heroHeight = isSmallDevice
    ? VerticalScale(235)
    : isLargeDevice
      ? VerticalScale(285)
      : VerticalScale(260);

  const avatarSize = isSmallDevice ? 125 : 145;

  const avatarWrapperSize = isSmallDevice ? 148 : 170;

  /* ============================================================
     LOAD USER
  ============================================================ */

  useEffect(() => {
    setUserData({
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar || null,
    });
  }, [user]);

  /* ============================================================
     UPDATE RESPONSE
  ============================================================ */

  const ProcessOfProfileUpdating = (res: any) => {
    console.log("Profile response:", res);

    setIsLoading(false);

    if (res.success) {
      updateToken(res.data.token);
      router.back();
    } else {
      Alert.alert("Profile", res.msg || "Unable to update profile.");
    }
  };

  /* ============================================================
     SOCKET
  ============================================================ */

  useEffect(() => {
    UpdatedProfile(ProcessOfProfileUpdating);

    return () => {
      UpdatedProfile(ProcessOfProfileUpdating, true);
    };
  }, []);

  /* ============================================================
     PICK IMAGE
  ============================================================ */

  const PickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Permission to access your gallery is required.",
      );

      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUserData((previous) => ({
        ...previous,
        avatar: result.assets[0],
      }));
    }
  };

  /* ============================================================
     UPDATE PROFILE
  ============================================================ */

  const OnSubmit = async () => {
    const { name, avatar } = userData;

    if (!name.trim()) {
      Alert.alert("Profile", "Please enter your name first.");

      return;
    }

    try {
      setIsLoading(true);

      const data: any = {
        name: name.trim(),
        avatar,
      };

      if (avatar && typeof avatar !== "string") {
        const res = await ReadyToUploadFile(avatar, "profiles");

        if (!res.success) {
          setIsLoading(false);

          Alert.alert(
            "Upload Failed",
            res.msg || "Unable to upload your image.",
          );

          return;
        }

        data.avatar = res.data;
      }

      console.log("Sending profile:", data);

      UpdatedProfile(data);
    } catch (error: any) {
      console.log("Profile update error:", error);

      setIsLoading(false);

      Alert.alert(
        "Update Failed",
        error?.message || "Something went wrong while updating your profile.",
      );
    }
  };

  /* ============================================================
     LOGOUT
  ============================================================ */

  const handleLogout = async () => {
    try {
      router.back();
      await signOut();
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const showLogoutConfirmation = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: handleLogout,
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  /* ============================================================
     AVATAR URI
  ============================================================ */

  const avatarUri =
    typeof userData.avatar === "string"
      ? userData.avatar
      : (userData.avatar?.uri ?? user?.avatar ?? null);

  /* ============================================================
     SCREEN
  ============================================================ */

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.screen}>
        {/* ======================================================
            HERO
        ====================================================== */}

        <LinearGradient
          colors={[
            gradientTheme.stop1,
            gradientTheme.stop2,
            gradientTheme.stop3,
            gradientTheme.stop4,
            gradientTheme.stop5,
          ]}
          locations={[0, 0.24, 0.48, 0.74, 1]}
          start={{
            x: 0.05,
            y: 0,
          }}
          end={{
            x: 0.95,
            y: 1,
          }}
          style={[
            styles.hero,
            {
              height: heroHeight,
              paddingHorizontal: horizontalPadding,
              paddingTop: insets.top + (Platform.OS === "ios" ? 12 : 12),
            },
          ]}
        >
          {/* DECORATIVE CIRCLES */}

          <View style={[styles.heroCircle, styles.circleOne]} />

          <View style={[styles.heroCircle, styles.circleTwo]} />

          <View style={[styles.heroCircleSmall, styles.circleThree]} />

          {/* TOP NAVIGATION */}

          <View style={styles.topBar}>
            <View style={styles.backArea}>
              <BackButton iconsize={23} color={colors.light1} />
            </View>

            <View style={styles.pageTitleBox}>
              <Typos style={styles.pageTitle}>Edit Profile</Typos>

              <Typos style={styles.pageSubtitle}>Account settings</Typos>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.back()}
              style={styles.closeButton}
            >
              <Icon.XIcon size={21} color={colors.light1} weight="bold" />
            </TouchableOpacity>
          </View>

          {/* HERO CONTENT */}

          <View style={styles.heroContent}>
           

            <Typos style={styles.heroTitle}>Make it yours.</Typos>

          </View>
        </LinearGradient>

        {/* ======================================================
            MAIN WHITE AREA
        ====================================================== */}

        <View style={styles.mainArea}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingHorizontal: horizontalPadding,
                paddingBottom: VerticalScale(35),
              },
            ]}
          >
            {/* ==================================================
                PROFILE HEADER
            ================================================== */}

            <View
              style={[
                styles.profileHeader,
                {
                  marginTop: isSmallDevice
                    ? VerticalScale(2)
                    : VerticalScale(8),
                },
              ]}
            >
              {/* AVATAR */}

              <View
                style={[
                  styles.avatarWrapper,
                  {
                    width: VerticalScale(avatarWrapperSize),
                    height: VerticalScale(avatarWrapperSize),
                  },
                ]}
              >
                <View
                  style={[
                    styles.avatarHalo,
                    {
                      width: VerticalScale(avatarWrapperSize),
                      height: VerticalScale(avatarWrapperSize),
                      borderRadius: VerticalScale(avatarWrapperSize / 2),
                    },
                  ]}
                />

                <View
                  style={[
                    styles.avatarFrame,
                    {
                      width: VerticalScale(avatarWrapperSize - 12),
                      height: VerticalScale(avatarWrapperSize - 12),
                      borderRadius: VerticalScale((avatarWrapperSize - 12) / 2),
                    },
                  ]}
                >
                  <Avatar uri={avatarUri} size={avatarSize} />
                </View>

                {/* EDIT BUTTON */}

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={PickImage}
                  style={[
                    styles.avatarEdit,
                    {
                      right: isSmallDevice ? 0 : 1,
                      bottom: isSmallDevice ? 2 : 4,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={[gradientTheme.ctaMid2, gradientTheme.ctaEnd]}
                    start={{
                      x: 0,
                      y: 0,
                    }}
                    end={{
                      x: 1,
                      y: 1,
                    }}
                    style={styles.avatarEditGradient}
                  >
                    <Icon.PencilSimpleIcon
                      size={isSmallDevice ? 18 : 21}
                      color={colors.light1}
                      weight="bold"
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
         {/* ==================================================
           Customized UserName 
            ================================================== */}
          <View style={styles.profileNameRow}>

  <LinearGradient
    colors={[
      gradientTheme.ctaMid1,
      gradientTheme.ctaMid2,
      gradientTheme.ctaEnd,
    ]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.nameGradient}
  >
    <Typos style={styles.uniqueUserName}>
      {userData.name || "Your Name"}
    </Typos>
  </LinearGradient>
</View>

              <TouchableOpacity activeOpacity={0.7} onPress={PickImage}>
                <Typos style={styles.changePhoto}>Change profile photo</Typos>
              </TouchableOpacity>
            </View>

            {/* ==================================================
                DETAILS
            ================================================== */}

            <View style={styles.detailsSection}>
              {/* SECTION HEADER */}

              <View style={styles.sectionHeader}>
                <View style={styles.sectionIndicator} />

                <View style={styles.sectionHeaderText}>
                  <Typos style={styles.sectionTitle}>
                    Personal Information
                  </Typos>

                  
                </View>
              </View>

              {/* EMAIL */}

              <ProfileField
                label="Email Address"
                value={userData.email}
                placeholder="Enter your email"
                disabled={true}
                keyboardType="email-address"
                autoCapitalize="none"
                icon={<Icon.At size={16} color={colors.gray2} />}
                rightElement={
                  <View style={styles.lockContainer}>
                    <Icon.LockSimpleIcon
                      size={14}
                      color={colors.gray1}
                      weight="bold"
                    />
                  </View>
                }
              />

              {/* NAME */}

              <ProfileField
                label="Full Name"
                value={userData.name}
                placeholder="Enter your name"
                autoCapitalize="words"
                onChangeText={(value: string) => {
                  setUserData((previous) => ({
                    ...previous,
                    name: value,
                  }));
                }}
                icon={<Icon.UserIcon size={16} color={colors.gray2} />}
              />

              {/* INFO */}

              <View style={styles.infoBox}>
                <View style={styles.infoIcon}>
                  <Icon.InfoIcon size={17} color={colors.gray2} weight="bold" />
                </View>
                <Typos style={styles.infoText}>
               Your email is linked to your account and can’t be changed here.
                </Typos>
              </View>
            </View>
          </ScrollView>

          {/* ====================================================
              BOTTOM ACTION BAR
          ==================================================== */}

          <View
            style={[
              styles.bottomBar,
              {
                paddingHorizontal: horizontalPadding,

                paddingBottom: Math.max(
                  insets.bottom,
                  Platform.OS === "ios" ? VerticalScale(12) : VerticalScale(10),
                ),
              },
            ]}
          >
            {/* LOGOUT */}

            <TouchableOpacity
              activeOpacity={0.78}
              onPress={showLogoutConfirmation}
              style={styles.logoutButton}
            >
              <Icon.SignOutIcon size={23} color={colors.neutral700} weight="bold" />
            </TouchableOpacity>

            {/* UPDATE */}

            <Button
              onPress={OnSubmit}
              loading={loading}
              gradientColors={[
                gradientTheme.subtext,
                gradientTheme.ctaMid1,
                gradientTheme.ctaMid2,
                gradientTheme.ctaEnd,
              ]}
              style={styles.updateButton}
            >
              <View style={styles.updateButtonContent}>
                <Typos style={styles.updateText}>Save Changes</Typos>

                <View style={styles.arrowCircle}>
                  <Icon.ArrowRightIcon
                    size={17}
                    color={colors.gray2}
                    weight="bold"
                  />
                </View>
              </View>
            </Button>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ProfileModel;

/* ==============================================================
   STYLES
============================================================== */

const styles = StyleSheet.create({
  /* ============================================================
     ROOT
  ============================================================ */

  root: {
    flex: 1,
  },

  screen: {
    flex: 1,
    backgroundColor: colors.ivoryWhite,
  },

  /* ============================================================
     HERO
  ============================================================ */

  hero: {
    paddingBottom: VerticalScale(24),

    justifyContent: "space-between",

    overflow: "hidden",
  },

  heroCircle: {
    position: "absolute",

    width: 230,
    height: 230,

    borderRadius: 999,
  },

  circleOne: {
    top: -105,
    right: -80,

    backgroundColor: "rgba(255,255,255,0.10)",
  },

  circleTwo: {
    bottom: -125,
    left: -95,

    backgroundColor: "rgba(255,209,102,0.09)",
  },

  heroCircleSmall: {
    position: "absolute",

    width: 100,
    height: 100,

    borderRadius: 999,
  },

  circleThree: {
    top: "40%",
    right: "14%",

    backgroundColor: "rgba(185,131,255,0.10)",
  },

  /* ============================================================
     TOP BAR
  ============================================================ */

  topBar: {
    width: "100%",

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  backArea: {
    width: 42,
    height: 42,

    alignItems: "flex-start",

    justifyContent: "center",
  },

  pageTitleBox: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",
  },

  pageTitle: {
    fontSize: 17,

    fontWeight: "800",

    color: colors.light1,
  },

  pageSubtitle: {
    marginTop: 1,

    fontSize: 10,

    color: "rgba(255,255,255,0.65)",
  },

  closeButton: {
    width: 42,
    height: 42,

    alignItems: "flex-end",

    justifyContent: "center",
  },

  /* ============================================================
     HERO CONTENT
  ============================================================ */

  heroContent: {
    paddingBottom: spacingY._30,
  },

  heroBadge: {
    width: 38,
    height: 38,

    marginBottom: spacingY._10,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: "rgba(255,255,255,0.13)",

    borderWidth: 1,

    borderColor: "rgba(255,255,255,0.15)",

    borderTopLeftRadius: 11,
    borderBottomRightRadius: 11,

    borderTopRightRadius: 4,
    borderBottomLeftRadius: 4,
  },

  heroTitle: {
    fontSize: 30,

    fontWeight: "800",

    color: colors.light1,
  },
  /* ============================================================
     MAIN AREA
  ============================================================ */

  mainArea: {
    flex: 1,

    marginTop: -28,

    backgroundColor: colors.ivoryWhite,

    borderTopLeftRadius: radius._40,

    borderTopRightRadius: radius._40,

    borderCurve: "continuous",

    overflow: "hidden",

    shadowColor: colors.black,

    shadowOffset: {
      width: 0,
      height: -5,
    },

    shadowOpacity: 0.12,

    shadowRadius: 14,

    elevation: 8,
  },

  scrollContent: {
    paddingTop: VerticalScale(28),
  },

  /* ============================================================
     PROFILE HEADER
  ============================================================ */

  profileHeader: {
    alignItems: "center",

    marginBottom: VerticalScale(25),
  },

  avatarWrapper: {
    position: "relative",

    alignItems: "center",

    justifyContent: "center",

    marginBottom: spacingY._10,
  },

  avatarHalo: {
    position: "absolute",

    backgroundColor: colors.lavender,

    opacity: 0.75,
  },

  avatarFrame: {
    alignItems: "center",

    justifyContent: "center",

backgroundColor: "#F1F0F2",

    borderWidth: 2,

    borderColor: "rgba(108,110,133,0.20)",

    shadowColor: colors.black,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.15,

    shadowRadius: 10,

    elevation: 5,

    overflow: "hidden",
  },

  avatarEdit: {
    position: "absolute",

    width: VerticalScale(47),

    height: VerticalScale(47),

    borderTopLeftRadius: 15,

    borderBottomRightRadius: 15,

    borderTopRightRadius: 6,

    borderBottomLeftRadius: 6,

    overflow: "hidden",

    borderWidth: 1,

    borderColor: "rgba(255,255,255,0.55)",

    shadowColor: colors.black,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.22,

    shadowRadius: 6,

    elevation: 6,
  },

  avatarEditGradient: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",
  },

  profileName: {
    fontSize: 22,

    fontWeight: "800",

    color: colors.black,

    marginTop: spacingY._5,
  },

  profileEmail: {
    fontSize: 12,

    color: colors.gray1,

    marginTop: 2,
  },

  changePhoto: {
    marginTop: spacingY._7,

    fontSize: 12,

    fontWeight: "700",

    color: colors.gray2,

    textDecorationLine: "underline",
  },

  /* ============================================================
     DETAILS
  ============================================================ */

  detailsSection: {
    gap: spacingY._15,
  },

  sectionHeader: {
    flexDirection: "row",

    alignItems: "center",

    gap: spacingX._10,

    marginBottom: spacingY._5,
  },

  sectionHeaderText: {
    flex: 1,
  },

  sectionIndicator: {
    width: 4,

    height: 42,

    backgroundColor: gradientTheme.ctaMid2,

    borderTopLeftRadius: 7,

    borderBottomRightRadius: 7,

    borderTopRightRadius: 2,

    borderBottomLeftRadius: 2,
  },

  sectionTitle: {
    fontSize: 17,

    fontWeight: "800",

    color: colors.black,
  },

  sectionDescription: {
    fontSize: 11,

    color: colors.gray1,

    marginTop: 2,
  },

  /* ============================================================
     FIELD
  ============================================================ */

  fieldBlock: {
    width: "100%",
  },

  fieldLabelRow: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 5,

    marginBottom: 6,
  },

  fieldLabel: {
    fontSize: 11,

    fontWeight: "700",

    letterSpacing: 0.7,

    textTransform: "uppercase",

    color: colors.gray1,
  },

  readOnlyLabel: {
    flexDirection: "row",

    alignItems: "center",

    gap: 4,
  },

  readOnlyText: {
    fontSize: 9,

    color: colors.gray1,

    fontWeight: "600",
  },

  inputBox: {
    minHeight: VerticalScale(52),

    width: "100%",

    flexDirection: "row",

    alignItems: "center",

    gap: spacingX._10,

    paddingHorizontal: spacingX._12,

    backgroundColor: colors.light1,

    borderWidth: 1,

    borderColor: colors.border,

    borderTopLeftRadius: 16,

    borderBottomRightRadius: 16,

    borderTopRightRadius: 7,

    borderBottomLeftRadius: 7,
  },

  inputBoxFocused: {
    backgroundColor: colors.ivoryWhite,

    borderColor: colors.gray1,
  },

  inputBoxDisabled: {
    backgroundColor: colors.light2,

    borderColor: colors.light3,
  },

  inputIcon: {
    width: 30,
    height: 30,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: colors.light3,

    borderTopLeftRadius: 8,

    borderBottomRightRadius: 8,

    borderTopRightRadius: 3,

    borderBottomLeftRadius: 3,
  },

  inputIconDisabled: {
    backgroundColor: colors.white1,
  },

  textInput: {
    flex: 1,

    height: "100%",

    paddingVertical: 0,

    fontSize: 15,

    color: colors.black,
  },

  disabledText: {
    color: colors.gray1,
  },

  lockContainer: {
    width: 28,
    height: 28,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: colors.white1,

    borderTopRightRadius: 7,

    borderBottomLeftRadius: 7,
  },

  /* ============================================================
     INFO
  ============================================================ */

  infoBox: {
    flexDirection: "row",

    alignItems: "center",

    gap: spacingX._10,

    paddingHorizontal: spacingX._12,

    paddingVertical: spacingY._10,

    backgroundColor: colors.lavender,

    borderWidth: 1,

    borderColor: "rgba(108,110,133,0.16)",

    borderTopLeftRadius: 13,

    borderBottomRightRadius: 13,

    borderTopRightRadius: 5,

    borderBottomLeftRadius: 5,
  },

  infoIcon: {
    width: 31,
    height: 31,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: "rgba(255,255,255,0.60)",

    borderTopLeftRadius: 8,

    borderBottomRightRadius: 8,
  },

  infoText: {
    flex: 1,

    fontSize: 11,

    lineHeight: 16,

    color: colors.gray2,
  },

  /* ============================================================
     BOTTOM BAR
  ============================================================ */

  bottomBar: {
    flexDirection: "row",

    alignItems: "center",

    gap: spacingX._12,

    paddingTop: spacingY._12,

    backgroundColor: colors.ivoryWhite,

    borderTopWidth: 1,

    borderTopColor: colors.neutral200,
  },

  /* ============================================================
     LOGOUT
  ============================================================ */

  logoutButton: {
    width: VerticalScale(54),

    height: VerticalScale(54),

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: "rgba(190,54,54,0.08)",

    borderWidth: 1,

    borderColor: "rgba(190,54,54,0.20)",

    borderTopLeftRadius: 17,

    borderBottomRightRadius: 17,

    borderTopRightRadius: 6,

    borderBottomLeftRadius: 6,
  },

  /* ============================================================
     UPDATE
  ============================================================ */

  updateButton: {
    flex: 1,

    height: VerticalScale(54),

    borderTopLeftRadius: 18,

    borderBottomRightRadius: 18,

    borderTopRightRadius: 6,

    borderBottomLeftRadius: 6,

    borderWidth: 0.7,

    borderColor: colors.black,
  },

  updateButtonContent: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: spacingX._10,
  },

  updateText: {
    fontSize: 16,

    fontWeight: "800",

    color: colors.light1,
  },

  arrowCircle: {
    width: 28,
    height: 28,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: "rgba(255,255,255,0.82)",

    borderRadius: 14,
  },


profileNameRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginTop: spacingY._5,
},

profileGreeting: {
  fontSize: 22,
  fontWeight: "700",
  color: colors.black,
},

nameGradient: {
  borderTopLeftRadius: 8,
  borderBottomRightRadius: 8,
  borderTopRightRadius: 2,
  borderBottomLeftRadius: 2,
  paddingHorizontal: 8,
  paddingVertical: 2,
},

uniqueUserName: {
  fontSize: 20,
  fontWeight: "900",
  color: colors.light1,
  letterSpacing: 0.3,
},

});
