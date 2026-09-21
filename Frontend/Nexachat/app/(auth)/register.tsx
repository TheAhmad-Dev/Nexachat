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

// const Register = () => {
//   const nameRef = useRef("");
//   const emailRef = useRef("");
//   const passwordRef = useRef("");
//   const router = useRouter();
//   const [isloading, setisloading] = useState(false);
//   const [showpassword, setshowpassword] = useState(false);
//   const { signUp } = useAuth();
//   const handleSubmit = async () => {
//     console.log("Name:", nameRef.current);
//     console.log("Email:", emailRef.current);
//     console.log("Password:", passwordRef.current);
//     if (
//       !nameRef.current.trim() ||
//       !emailRef.current.trim() ||
//       !passwordRef.current.trim()
//     ) {
//       Alert.alert("Sign Up ", "Please fill up the all fields ");
//       return;
//     }

//     // the try catch block is used by the sign up hook
//     //  try {
//     //       setisloading(true);
//     //       await signUp(nameRef.current, emailRef.current, passwordRef.current ,"");
//     //     } catch (error: any) {
//     //       Alert.alert("Registration Failed  !  ", error.message);
//     //     } finally {
//     //       setisloading(false);
//     //     }
//     try {
//       setisloading(true);

//       await signUp(nameRef.current, emailRef.current, passwordRef.current, "");
//     } catch (error: any) {
//       console.log("===== SIGNUP ERROR =====");

//       if (error.response) {
//         console.log("STATUS:", error.response.status);
//         console.log("DATA:", error.response.data);

//         Alert.alert(
//           "Registration Failed",
//           error.response.data.msg ||
//             error.response.data.message ||
//             "Unknown server error",
//         );
//       } else {
//         console.log("ERROR:", error);

//         Alert.alert("Registration Failed", error.message || "Network Error");
//       }
//     } finally {
//       setisloading(false);
//     }
//   };

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
//               Getting Started
//             </Typos>
//             <Typos color={colors.black}>Create Account to continue .</Typos>
//             <Input
//               placeholder="Enter your Name :"
//               onChangeText={(value: string) => (nameRef.current = value)}
//               icon={
//                 <Icon.User size={VerticalScale(25)} color={colors.neutral600} />
//               }
//             />
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
//               style={{
//                 backgroundColor: colors.myBubble,
//                 width: 220,
//                 height: 45,
//                 borderRadius: 12,
//                 borderColor: colors.neutral500,
//                 borderWidth: 1.5,
//                 marginTop: 55,
//                 marginBottom: 22,
//                 paddingLeft: 70,
//               }}
//             >
//               <Typos color={colors.black} size={22} fontWeight={"bold"}>
//                 Sign Up
//               </Typos>
//             </Button>
//           </View>
//           <View style={styles.footer}>
//             <Typos style={{ color: colors.neutral800 }} fontWeight="300">
//               Already have Account ?
//             </Typos>
//             <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
//               <Typos style={{ color: colors.rose  , textDecorationLine:"underline"}} size={18} fontWeight="bold">
//                 Login
//               </Typos>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScreenWrapper>
//     </KeyboardAvoidingView>
//   );
// };

// export default Register;

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
import { colors, gradientTheme, radius, spacingX, spacingY } from "@/constants/theme";
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
  a: { borderTopLeftRadius: 14, borderBottomRightRadius: 14, borderTopRightRadius: 8, borderBottomLeftRadius: 8 },
  b: { borderTopRightRadius: 14, borderBottomLeftRadius: 14, borderTopLeftRadius: 8, borderBottomRightRadius: 8 },
  c: { borderTopLeftRadius: 14, borderBottomLeftRadius: 14, borderTopRightRadius: 8, borderBottomRightRadius: 8 },
};

const FieldShell = ({ label, icon, shape, rightIcon, ...inputProps }: any) => {
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
            paddingLeft: 6 
            }}>
        {label}
      </Typos>
      <View style={[styles.fieldShell, shapeStyles[shape as "a" | "b" | "c"], focused && styles.fieldShellFocused]}>
        <View style={styles.iconWrap}>{icon}</View>
        <TextInput
          {...inputProps}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={colors.placeholder}
          style={styles.input}
        />
        {rightIcon}
      </View>
    </View>
  );
};

const Register = () => {
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const router = useRouter();
  const [isloading, setisloading] = useState(false);
  const [showpassword, setshowpassword] = useState(false);
  const { signUp, updateToken } = useAuth();

  const handleSubmit = async () => {
    if (!nameRef.current.trim() || !emailRef.current.trim() || !passwordRef.current.trim()) {
      Alert.alert("Sign Up", "Please fill up all fields");
      return;
    }
    try {
      setisloading(true);
      await signUp(nameRef.current, emailRef.current, passwordRef.current, "");
    } catch (error: any) {
      if (error.response) {
        Alert.alert("Registration Failed", error.response.data.msg || error.response.data.message || "Unknown server error");
      } else {
        Alert.alert("Registration Failed", error.message || "Network Error");
      }
    } finally {
      setisloading(false);
    }
  };

  return (
    <KeyboardAvoidingView
     style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.screen}>
        {/* HERO — 28% of screen, muted poster-gray vertical gradient */}
    <LinearGradient
colors={[
  gradientTheme.stop1,
  gradientTheme.stop2,
  gradientTheme.stop3,
  gradientTheme.stop4,
  gradientTheme.stop5,
]}
   locations={[0, 0.25, 0.50, 0.75, 1.3]}

          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.88, y: 1 }}
          style={styles.hero}
        >
          <View style={[styles.blob, { top: -60, right: -60, backgroundColor: "rgba(255,255,255,0.10)" }]} />
          <View style={[styles.blob, { bottom: -40, left: -30, width: 160, height: 160, backgroundColor: "rgba(255,209,102,0.12)" }]} />

          <View style={styles.nav}>
            <BackButton iconsize={22} color={colors.light1} />
            <TouchableOpacity>
              <Typos
               style={{
                 fontSize: 13, 
                 fontWeight: "700",
                  color: "rgba(255,255,255,0.85)", 
                  textDecorationLine: "underline"
                   }}>
                Need help?
              </Typos>
            </TouchableOpacity>
          </View>

          <View style={styles.constellation}>
          
      
          </View>
        </LinearGradient>

        {/* SHEET — gradient seam at top (posterGray → white) instead of a hard cut */}
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
             color: colors.black 
             }}>
              Getting Started
              </Typos>
          <Typos
           style={{ 
            fontSize: 13,
             color: colors.textGray,
              marginTop: 4,
               marginBottom: spacingY._15
                }}>
            Create an account to continue.
          </Typos>

          <FieldShell
            label="Full name" shape="a" placeholder="Enter your name" autoComplete="name"
            onChangeText={(v: string) => (nameRef.current = v)}
            icon={<Icon.User size={15} color={colors.gray2} />}
          />
          <FieldShell
            label="Email" shape="b" placeholder="Enter email" autoComplete="email"
            keyboardType="email-address" autoCapitalize="none"
            onChangeText={(v: string) => (emailRef.current = v)}
            icon={<Icon.At size={15} color={colors.gray2} />}
          />
          <FieldShell
            label="Password" shape="c" placeholder="Enter password"
            secureTextEntry={!showpassword} autoComplete="password-new"
            onChangeText={(v: string) => (passwordRef.current = v)}
            icon={<Icon.LockIcon size={15} color={colors.gray2} />}
            rightIcon={
              <TouchableOpacity onPress={() => setshowpassword(!showpassword)}>
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
              borderColor :colors.black, 
              borderWidth : 0.7
            }}
             
          >
            <Typos 
            style={{
               fontSize: 16,
                fontWeight: "800", 
                color: colors.light1 
                }}>
                  Sign Up
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
              // Store the session exactly like a normal signup.
              await updateToken(session.token);
              router.replace("/(main)/home");
            }}
            onError={(message) => Alert.alert("Google Sign-In", message)}
          />

          <View style={styles.footer}>
            <Typos 
            style={{
               fontSize: 13,
                color: colors.black }}>
                  Already have an account ?
                   </Typos>
            <TouchableOpacity
             onPress={() => router.push("/(auth)/login")}>
              <Typos 
              style={{
                 fontSize: 17, 
                 fontWeight: "800",
                  color: colors.gray2,
                   textDecorationLine: "underline"
                    }}>
                Login
              </Typos>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  screen: {
     flex: 1,
      backgroundColor: "#ffffff"
     },
  hero: {
    flex: 0.30, // <-- this is what forces "almost half the page" purple
    paddingTop: spacingY._40,
    paddingHorizontal: spacingX._25,
    paddingBottom: spacingY._20,
    justifyContent: "space-between",
    overflow: "hidden",
  },
    blob: {
       position: "absolute",
        width: 200, 
        height: 200,
         borderRadius: 999
         },
  nav: {
     flexDirection: "row",
      justifyContent: "space-between",
       alignItems: "center" ,
      paddingTop: 50 },

  constellation: {
     flexDirection: "row",
      alignItems: "center",
       gap: 14 
      },
  badge: {
    width: 40, height: 40,
    backgroundColor: colors.light2,
    alignItems: "center", justifyContent: "center",
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
  paddingVertical: 6,      // ↓ was 10
  paddingHorizontal: 12,   // ↓ was 14
},
  fieldShellFocused: { 
    borderColor: colors.gray1 ,
     backgroundColor: "#ffffff" },
  iconWrap: {
    width: 28, height: 28,
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
       color: colors.black
       },
  footer: {
     flexDirection: "row", 
     justifyContent: "center",
      alignItems: "center",
       marginTop: spacingY._15,
        gap: 5
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