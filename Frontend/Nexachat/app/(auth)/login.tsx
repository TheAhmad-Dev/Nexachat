// import BackButton from "@/components/BackButton";
// import Button from "@/components/Button";
// import Input from "@/components/Input";
// import ScreenWrapper from "@/components/ScreenWrapper";
// import Typos from "@/components/typos";
// import { colors, radius, spacingX, spacingY } from "@/constants/theme";
// import { useAuth } from "@/context/authcontext";
// import { VerticalScale } from "@/utils/styling";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import * as Icon from "phosphor-react-native";
// import React, { useRef, useState } from "react";
// import {
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   TouchableOpacity,
//   View,
// } from "react-native";

// const Login = () => {
//   const nameRef = useRef("");
//   const emailRef = useRef("");
//   const passwordRef = useRef("");
//   const router = useRouter();
//   const [isloading, setisloading] = useState(false);
//   const [showpassword, setshowpassword] = useState(false);
//   const {signIn}= useAuth();
//     const handleSubmit = async () => {
   
//       console.log("Email:", emailRef.current);
//       console.log("Password:", passwordRef.current);
//       if (
      
//         !emailRef.current.trim() ||
//         !passwordRef.current.trim()
//       ) {
//         Alert.alert("Sign Up ", "Please fill up the all fields ");
//         return;
//       }
  
//       // the try catch block is used by the sign up hook
//       //  try {
//       //       setisloading(true);
//       //       await signUp(nameRef.current, emailRef.current, passwordRef.current ,"");
//       //     } catch (error: any) {
//       //       Alert.alert("Registration Failed  !  ", error.message);
//       //     } finally {
//       //       setisloading(false);
//       //     }
//       try {
//         setisloading(true);
  
//         await signIn(emailRef.current, passwordRef.current );
//       } catch (error: any) {
//         console.log("===== Login ERROR =====");
  
//         if (error.response) {
//           console.log("STATUS:", error.response.status);
//           console.log("DATA:", error.response.data);
  
//          Alert.alert(
//             "Login  Failed",
//             error.response.data.msg ||
//               error.response.data.message ||
//               "Unknown server error",
//           );
//         } else {
//           console.log("ERROR:", error);
  
//           Alert.alert("Login Failed", error.message || "Network Error");
//         }
//       } finally {
//         setisloading(false);
//       }
//     };
//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <ScreenWrapper style={styles.container} showPattren={true}>
//         <View style={styles.header}>
//           <BackButton iconsize={30} color={colors.white} />
//           <Typos
//             style={{ paddingRight: 154 }}
//             fontWeight="700"
//             color={colors.white}
//             size={18}
//           >
//             Back
//           </Typos>
//           <Typos color={colors.white} fontWeight="700" size={18}>
//             Need help ?
//           </Typos>
//         </View>
//         <View style={styles.content}>
//           <View style={styles.form}>
//             <Typos color={colors.black} fontWeight="bold" size={20}>
//               WelCome Back
//             </Typos>
//             <Typos color={colors.black}>Glad to see you Again.</Typos>

//             <Input
//               placeholder="Enter  Email : "
//               onChangeText={(value: string) => (emailRef.current = value)}
//               icon={
//                 <Icon.At size={VerticalScale(25)} color={colors.neutral600} />
//               }
//             />
//             <Input
//               placeholder="Enter password : "
//               onChangeText={(value: string) => (passwordRef.current = value)}
//               secureTextEntry={!showpassword}
//               icon={
//                 <Icon.LockIcon
//                   size={VerticalScale(25)}
//                   color={colors.neutral600}
//                 />
//               }
//               rightIcon={
//                 <TouchableOpacity
//                   onPress={() => setshowpassword(!showpassword)}
//                 >
//                   <Ionicons
//                     style={{ alignSelf: "flex-end" }}
//                     name={showpassword ? "eye-outline" : "eye-off-outline"}
//                     size={24}
//                   />
//                 </TouchableOpacity>
//               }
//             />
//             <Button
//               onPress={handleSubmit}
//               loading={isloading}
//               style={{
//                 backgroundColor: colors.myBubble,
//                 width: 220,
//                 height: 45,
//                 borderRadius: 12,
//                 borderColor: colors.neutral500,
//                 borderWidth: 1.5,
//                 marginTop: 55,
//                 marginBottom: 22,
//                 paddingLeft: 83,
//               }}
//             >
//               <Typos color={colors.black} size={22} fontWeight={"bold"}  >
//                 Login
//               </Typos>
//             </Button>
//           </View>
//           <View style={styles.footer}>
//             <Typos style={{ color: colors.neutral800 }} fontWeight="300">
//               New User ?
//             </Typos>
//             <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
//               <Typos style={{ color: colors.rose , textDecorationLine :"underline" }} size={20} fontWeight="bold" >
//                 Sign up
//               </Typos>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScreenWrapper>
//     </KeyboardAvoidingView>
//   );
// };

// export default Login;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "space-between",
//   },
//   header: {
//     paddingHorizontal: spacingX._20,
//     paddingTop: spacingY._5,
//     paddingBottom: spacingY._40, // increase the white space of chatting background
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
//     alignContent: "center",
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
//   footer: {
//     gap: 5,
//     justifyContent: "center",
//     alignItems: "center",
//     flexDirection: "row",
//   },
// });




import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import GoogleButton from "@/components/GoogleButton";
import Typos from "@/components/typos";
import {
  colors,
  gradientTheme,
  radius,
  spacingX,
  spacingY,
} from "@/constants/theme";
import { useAuth } from "@/context/authcontext";
import { VerticalScale } from "@/utils/styling";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Icon from "phosphor-react-native";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


const shapeStyles = {
  a: {
    borderTopLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  b: {
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 14,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  c: {
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
};

/*
  // ===== Main function of this page  =====
  1.Takes input field
  2. set focused when clicked 
  3.used in taking password and email as well 
  */

 
const FieldShell = ({
  label,
  icon,
  shape,
  rightIcon,
  ...inputProps
}: any) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ marginBottom: spacingY._15 }}>
      <Typos
        style={{
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 0.6,
          textTransform: "uppercase",
          color: colors.gray1,
          marginBottom: 6,
          paddingLeft: 6,
        }}
      >
        {label}
      </Typos>

      <View
        style={[
          styles.fieldShell,
          shapeStyles[shape as "a" | "b" | "c"],
          focused && styles.fieldShellFocused,
        ]}
      >
        <View style={styles.iconWrap}>{icon}</View>

        <TextInput
          {...inputProps}
          style={styles.input}
          placeholderTextColor={colors.placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        {rightIcon}
      </View>
    </View>
  );
};
const Login = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const router = useRouter();

  const [isloading, setisloading] = useState(false);
  const [showpassword, setshowpassword] = useState(false);

  const { signIn, updateToken } = useAuth();



 /*
              Call Back to the Check the Authenticity of the user existence in the system 


through (await signIn(emailRef.current, passwordRef.current);)

  ========== It delegates authentication to useAuth() / signIn().===========
 
and   set show paswword is false by default 

    */

  const handleSubmit = async () => {
    if (!emailRef.current.trim() || !passwordRef.current.trim()) {
      Alert.alert("Login", "Please fill up all fields");
      return;
    }

    try {
      setisloading(true);

      await signIn(emailRef.current, passwordRef.current);
    } catch (error: any) {
      if (error.response) {
        Alert.alert(
          "Login Failed",
          error.response.data.msg ||
            error.response.data.message ||
            "Unknown server error"
        );
      } else {
        Alert.alert("Login Failed", error.message || "Network Error");
      }
    } finally {
      setisloading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.screen}>
        <LinearGradient
          colors={[
            gradientTheme.stop1,
            gradientTheme.stop2,
            gradientTheme.stop3,
            gradientTheme.stop4,
            gradientTheme.stop5,
          ]}
          locations={[0, 0.25, 0.5, 0.75, 1]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.88, y: 1 }}
          style={styles.headerSection}
        >
          <View
            style={[
              styles.backgroundShape,
              {
                top: -60,
                right: -60,
                backgroundColor: "rgba(255,255,255,0.10)",
              },
            ]}
          />

          <View
            style={[
              styles.backgroundShape,
              {
                bottom: -40,
                left: -30,
                width: 160,
                height: 160,
                backgroundColor: "rgba(255,209,102,0.12)",
              },
            ]}
          />

          <View style={styles.headerNavigation}>
            <BackButton iconsize={22} color={colors.light1} />

            <TouchableOpacity>
              <Typos
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: "rgba(255,255,255,0.85)",
                  textDecorationLine: "underline",
                }}
              >
                Need help?
              </Typos>
            </TouchableOpacity>
          </View>

          <View style={styles.headerDecorations} />
        </LinearGradient>

        <LinearGradient
          colors={[colors.purple3, colors.purple2, "#ffffff"]}
          locations={[0, 0.1, 0.22]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.sheet}
        >
          <Typos
            style={{
              fontSize: 24,
              fontWeight: "800",
              color: colors.black,
            }}
          >
            Welcome Back
          </Typos>

          <Typos
            style={{
              fontSize: 16,
              color: colors.black,
              marginTop: 4,
              marginBottom: spacingY._15,
            }}
          >
            Glad to see you again.
          </Typos>

          <FieldShell
            label="Email"
            shape="a"
            placeholder="Enter your email"
            autoComplete="email"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(value: string) => (emailRef.current = value)}
            icon={<Icon.At size={15} color={colors.gray2} />}
          />

          <FieldShell
            label="Password"
            shape="b"
            placeholder="Enter password"
            secureTextEntry={!showpassword}
            autoComplete="password"
            onChangeText={(value: string) => (passwordRef.current = value)}
            icon={<Icon.LockIcon size={15} color={colors.gray2} />}
            rightIcon={
              <TouchableOpacity
                onPress={() => setshowpassword(!showpassword)}
              >
                <Ionicons
                  name={showpassword ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color={colors.placeholder}
                />
              </TouchableOpacity>
            }
          />

          <Button
            onPress={handleSubmit}
            loading={isloading}
            gradientColors={[
              gradientTheme.subtext,
              gradientTheme.ctaMid1,
              gradientTheme.ctaMid2,
              gradientTheme.ctaEnd,
            ]}
            style={{
              width: "100%",
              height: VerticalScale(50),
              borderTopLeftRadius: 18,
              borderBottomRightRadius: 18,
              borderTopRightRadius: 6,
              borderBottomLeftRadius: 6,
              marginTop: spacingY._5,
              borderColor: colors.black,
              borderWidth: 0.7,
            }}
          >
            <Typos
              style={{
                fontSize: 16,
                fontWeight: "800",
                color: colors.light1,
              }}
            >
              Login
            </Typos>
          </Button>

          {/* ===== DIVIDER ===== */}
          <View style={styles.googleDivider}>
            <View style={styles.dividerLine} />
            <Typos style={styles.dividerText}>or</Typos>
            <View style={styles.dividerLine} />
          </View>

          {/* ===== CONTINUE WITH GOOGLE (self-contained component) ===== */}
          <GoogleButton
            onSession={async (session) => {
              // Store the session exactly like a normal login.
              await updateToken(session.token);
              router.replace("/(main)/home");
            }}
            onError={(message) => Alert.alert("Google Sign-In", message)}
          />

          <View style={styles.footer}>
            <Typos
              style={{
                fontSize: 13,
                color: colors.black,
              }}
            >
              New User?
            </Typos>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/register")}
            >
              <Typos
                style={{
                  fontSize: 17,
                  fontWeight: "800",
                  color: colors.gray2,
                  textDecorationLine: "underline",
                }}
              >
                Sign Up
              </Typos>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  headerSection: {
    flex: 0.30,
    paddingTop: spacingY._40,
    paddingHorizontal: spacingX._25,
    paddingBottom: spacingY._20,
    justifyContent: "space-between",
    overflow: "hidden",
  },

  backgroundShape: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 999,
  },

  headerNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
  },

  headerDecorations: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  headerBadge: {
    width: 40,
    height: 40,
    backgroundColor: colors.light2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },

  sheet: {
    flex: 0.72,
    marginTop: -16,
    borderTopLeftRadius: radius._30,
    borderTopRightRadius: radius._30,
    paddingHorizontal: spacingX._25,
    paddingTop: spacingY._20,
    overflow: "hidden",
  },

  fieldShell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.light1,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  fieldShellFocused: {
    borderColor: colors.gray1,
    backgroundColor: "#ffffff",
  },

//  Controls the small decorative icon box inside the input

  iconWrap: {
    width: 28,
    height: 28,
    backgroundColor: colors.light3,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 3,
    borderBottomLeftRadius: 3,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: colors.black,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacingY._15,
    gap: 5,
  },

  googleDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacingY._15,
    marginBottom: spacingY._5,
    gap: 10,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  dividerText: {
    fontSize: 11,
    color: colors.textGray,
  },
});

/*
            headerSection

Controls the entire upper gradient section:

┌─────────────────────────┐
│ Back            Help    │
│                         │
│     gradient / backgroundShapes    │
│                         │
└─────────────────────────┘



sheet

Controls the large lower form section:

       ╭────────────────────╮
       │ Welcome Back       │
       │                    │
       │ Email              │
       │ Password           │
       │ Login              │
       │                    │
       │ New User? Sign Up  │
       ╰────────────────────╯

  */