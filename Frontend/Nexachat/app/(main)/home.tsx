// import {
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import {
//   getconversation,
//   newConversation,
//   newMessage,
//   TestSockets,
// } from "@/socket/socketEvents";
// import ScreenWrapper from "@/components/ScreenWrapper";
// import Typos from "@/components/typos";
// import { colors, radius, spacingX, spacingY } from "@/constants/theme";
// import { useAuth } from "@/context/authcontext";
// import * as Icon from "phosphor-react-native";

// import { getSocket } from "@/socket/sockets";
// import { router, useRouter } from "expo-router";
// import { VerticalScale } from "@/utils/styling";
// import MyConversationList from "@/components/conversationList";
// import Loading from "@/components/Loading";
// import Button from "@/components/Button";
// import { ConversationProps, ResponseProps } from "@/types";

// // import {TestSocket}  from "../"
// const Home = () => {
//   const { user } = useAuth();
//   const [selectTab, setselectedTab] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [conversation, setConversations] = useState<ConversationProps[]>([]);
//   console.log("User :", user);
//   const router = useRouter();
//   //Temporarily Commented to use

//   // useEffect(()=>{

//   //   const checkSocket = getSocket();

//   //   console.log("Current socket:", checkSocket?.id);

//   //   TestSockets(TestSocketCallBackHandler);

//   //   TestSockets({
//   //     message:"Hello backend"
//   //   });

//   //   return ()=>{
//   //     TestSockets(TestSocketCallBackHandler,true);
//   //   }

//   // },[]);
//   useEffect(() => {
//     getconversation(processOfGettingConversation);
//     newConversation(newConversationHandlerhere);
//     getconversation(null);
//     newMessage(newMessageUpdateHandler);
//     return () => {
//       getconversation(processOfGettingConversation, true);
//       newConversation(newConversationHandlerhere, true);
//       newMessage(newMessageUpdateHandler, true);
//     };
//   }, []);

//   const newConversationHandlerhere = (res: ResponseProps) => {
//     if (!res.success || !res.data?.isNew) return;

//     setConversations((prev: any[]) => {
//       const exists = prev.some(
//         (conversation) => conversation._id === res.data._id,
//       );

//       if (exists) return prev;

//       return [res.data, ...prev];
//     });
//   };
//   const processOfGettingConversation = (res: any) => {
//     console.log("Process of Getting New Conversation", res);
//     if (res.success) {
//       setConversations(res.data);
//     }
//   };

//   const TestSocketCallBackHandler = (data: any) => {
//     console.log("Backend Response:", data);
//   };

//   const newMessageUpdateHandler = (res: ResponseProps) => {
//     if (res.success) {
//       let ConversationId = res.data.conversationId;
//       setConversations((prev) => {
//         let UpdatedConversationItem = prev.map((item) => {
//           if (item._id == ConversationId) item.lastMessage = res.data;
//           return item;
//         });
//         return UpdatedConversationItem;
//       });
//     }
//   };


//   let directConversation = conversation
//     .filter((item: ConversationProps) => item.type == "direct")
//     .sort((a: ConversationProps, b: ConversationProps) => {
//       const aDate = a.lastMessage?.createdAt || a.createdAt;
//       const bDate = b.lastMessage?.createdAt || b.createdAt;
//       return new Date(bDate).getTime() - new Date(aDate).getTime();
//     });
//   let groupConversation = conversation
//     .filter((item: ConversationProps) => item.type == "group")
//     .sort((a: ConversationProps, b: ConversationProps) => {
//       const aDate = a.lastMessage?.createdAt || a.createdAt;
//       const bDate = b.lastMessage?.createdAt || b.createdAt;
//       return new Date(bDate).getTime() - new Date(aDate).getTime();
//     });
//   // let directConversation  =[];
//   // let groupConversation = [];
//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <ScreenWrapper
//         style={styles.container}
//         showPattren={true}
//         backgroundOpacity={1}
//       >
//         <View style={styles.header}>
//           <Typos
//             color={colors.white}
//             size={17}
//             textProps={{ numberOfLines: 1 }}
//           >
//             Welcome Back ,🤗{"  "}
//             <Typos color={colors.warmOrange} size={23} fontWeight="bold">
//               {user?.name}
//             </Typos>
//             {"    "}👋
//           </Typos>
//           <TouchableOpacity onPress={() => router.push("/profileModel")}>
//             <Icon.GearSix size={30} color={colors.white} />
//           </TouchableOpacity>
//           {/*      
//      <Typos color={colors.white}    fontWeight="bold" size={18} style={{paddingLeft: 55}}>
//       Log out
//      </Typos>
//      <LogoutButton    iconsize={30} color={colors.warmOrange} /> */}
//         </View>
//         <View style={styles.content}>
//           <ScrollView
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={{ paddingVertical: spacingY._20 }}
//           >
//             <View style={styles.nevBar}>
//               <View style={styles.tabs}>
//                 <TouchableOpacity
//                   onPress={() => setselectedTab(0)}
//                   style={[
//                     styles.tabStyle,
//                     selectTab == 0 && styles.avtiveTabBarStyle,
//                   ]}
//                 >
//                   <Typos color={colors.black} size={16} fontWeight="600">
//                     {" "}
//                     Direct Messages
//                   </Typos>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => setselectedTab(1)}
//                   style={[
//                     styles.tabStyle,
//                     selectTab == 1 && styles.avtiveTabBarStyle,
//                   ]}
//                 >
//                   <Typos color={colors.black} size={16} fontWeight="600">
//                     {" "}
//                     Groups{" "}
//                   </Typos>
//                 </TouchableOpacity>
//               </View>
//             </View>
//             <View style={styles.conversationList}>
//               {selectTab == 0 &&
//                 directConversation.map((item: ConversationProps, index) => {
//                   return (
//                     <MyConversationList
//                       key={index}
//                       item={item}
//                       router={router}
//                       showDivider={directConversation.length != index + 1}
//                     />
//                   );
//                 })}

//               {selectTab == 1 &&
//                 groupConversation.map((item: any, index) => {
//                   return (
//                     <MyConversationList
//                       key={index}
//                       item={item}
//                       router={router}
//                       showDivider={directConversation.length != index + 1}
//                     />
//                   );
//                 })}
//             </View>
//             {!loading && selectTab == 0 && directConversation.length === 0 && (
//               <Typos size={16} fontWeight="600" style={{ textAlign: "center" }}>
//                 You don't have any Message yet
//               </Typos>
//             )}
//             {!loading && selectTab == 1 && groupConversation.length === 0 && (
//               <Typos size={16} fontWeight="600" style={{ textAlign: "center" }}>
//                 No Group Created yet
//               </Typos>
//             )}
//           </ScrollView>
//         </View>
//         <Button
//           style={styles.floatingButton}
//           onPress={() =>
//             router.push({
//               pathname: "/(main)/NewUserConversationModel",
//               params: {
//                 isGroup: String(selectTab),
//               },
//             })
//           }
//         >
//           <Icon.Plus
//             color={colors.black}
//             size={VerticalScale(30)}
//             weight="bold"
//           />
//         </Button>
//       </ScreenWrapper>
//     </KeyboardAvoidingView>
//   );
// };

// export default Home;

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

//   nevBar: {
//     flexDirection: "row",
//     gap: spacingX._15,
//     alignItems: "center",
//     paddingHorizontal: spacingX._10,
//   },

//   tabs: {
//     flexDirection: "row",
//     gap: spacingX._10,
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   tabStyle: {
//     paddingVertical: spacingY._10,
//     paddingHorizontal: spacingX._20,
//     borderRadius: radius.full,
//     backgroundColor: colors.neutral200,
//   },
//   avtiveTabBarStyle: {
//     backgroundColor: colors.primaryLight,
//   },
//   conversationList: {
//     paddingVertical: spacingY._20,
//   },
//   SettingIcon: {
//     padding: spacingY._10,
//     borderRadius: radius.full,
//     backgroundColor: colors.neutral700,
//   },
//   floatingButton: {
//     height: VerticalScale(50),
//     width: VerticalScale(50),
//     borderRadius: 100,
//     position: "absolute",
//     bottom: VerticalScale(30),
//     right: VerticalScale(30),
//   },
// });












import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
    Keyboard,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  getconversation,
  newConversation,
  newMessage,
} from "@/socket/socketEvents";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typos from "@/components/typos";
import { gradientTheme, colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authcontext";
import * as Icon from "phosphor-react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router/react-navigation";
import { VerticalScale } from "@/utils/styling";
import MyConversationList from "@/components/conversationList";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import { ConversationProps, ResponseProps } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
const Home = () => {
  const { user } = useAuth();
  const [selectTab, setselectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [conversation, setConversations] = useState<ConversationProps[]>([]);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  // ✅ FIX: some auth payloads use `_id` instead of `id`. Fall back so
  // the "other participant" comparison below actually works.
  const currentUserId = user?.id || (user as any)?._id;

  useEffect(() => {
    getconversation(processOfGettingConversation);
    newConversation(newConversationHandlerhere);
    newMessage(newMessageUpdateHandler);
    return () => {
      getconversation(processOfGettingConversation, true);
      newConversation(newConversationHandlerhere, true);
      newMessage(newMessageUpdateHandler, true);
    };
  }, []);

 
  useFocusEffect(
    React.useCallback(() => {
      getconversation(null);
    }, [])
  );

  const newConversationHandlerhere = (res: ResponseProps) => {
    if (!res.success || !res.data?.isNew) return;
    setConversations((prev: any[]) => {
      const exists = prev.some((c) => c._id === res.data._id);
      if (exists) return prev;
      return [res.data, ...prev];
    });
  };

  const processOfGettingConversation = (res: any) => {
    if (res.success) setConversations(res.data);
  };

  const newMessageUpdateHandler = (res: ResponseProps) => {
    if (!res.success) return;
    const ConversationId = res.data.conversationId;

    setConversations((prev) => {
      const existsAlready = prev.some((item) => item._id == ConversationId);

      // dropping the update.
      if (!existsAlready) {
        getconversation(null);
        return prev;
      }

      return prev.map((item) =>
        item._id == ConversationId
          ? { ...item, lastMessage: res.data }
          : item
      );
    });
  };

  const getOtherParticipant = (item: any) => {
    return item?.participants?.find(
      (p: any) => String(p?._id ?? p?.id) !== String(currentUserId)
    );
  };

  let directConversation = conversation
    .filter((item: ConversationProps) => item.type == "direct")
    .sort((a: ConversationProps, b: ConversationProps) => {
      const aDate = a.lastMessage?.createdAt || a.createdAt;
      const bDate = b.lastMessage?.createdAt || b.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  let groupConversation = conversation
    .filter((item: ConversationProps) => item.type == "group")
    .sort((a: ConversationProps, b: ConversationProps) => {
      const aDate = a.lastMessage?.createdAt || a.createdAt;
      const bDate = b.lastMessage?.createdAt || b.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

  const filteredDirect = useMemo(() => {
    if (!searchText.trim()) return directConversation;
    return directConversation.filter((item: any) => {
      const other = getOtherParticipant(item);
      return other?.name?.toLowerCase().includes(searchText.toLowerCase());
    });
  }, [searchText, conversation, currentUserId]);

  const filteredGroup = useMemo(() => {
    if (!searchText.trim()) return groupConversation;
    return groupConversation.filter((item: any) =>
      item?.name?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, conversation]);

  const avatarRowItems = useMemo(() => {
    return directConversation.slice(0, 5).map((item: any) => {
      const other = getOtherParticipant(item);
      return {
        id: item._id, // conversation _id — this is what "Chatting" expects as `id`
        otherUserId: other?._id ?? other?.id ?? null,
        name: other?.name ?? "—",
        avatar: other?.avatar ?? null,
        type: item.type,
        participants: item.participants, // pass through untouched, matches MyConversationList
      };
    });
  }, [directConversation, currentUserId]);

  const handleAvatarPress = (item: {
    id: string;
    otherUserId: string | null;
    name: string;
    avatar: string | null;
    type: string;
    participants: any;
  }) => {
    router.push({
      pathname: "/(main)/Chatting",
      params: {
        id: item.id,
        name: item.name,
        avatar: item.avatar ?? "",
        type: item.type,
        participants: JSON.stringify(item.participants ?? []),
      },
    });
  };

  return (
    <ScreenWrapper showPattren={true}>
   <LinearGradient
  colors={[
    gradientTheme.stop3,
    gradientTheme.stop2,
    gradientTheme.stop3,
    gradientTheme.stop4,
    gradientTheme.stop5,
  ]}
  
start={{ x: 1, y: 0 }}
end={{ x: 0, y: 1 }}
  style={StyleSheet.absoluteFillObject}
>
        {/* ===== GRADIENT HEADER — hard cut to black, literal reference match ===== */}
        <View style={styles.gradientHeader}>
        <View style={styles.searchRow}>
  <View style={styles.searchBar}>
    <Icon.MagnifyingGlass
      size={14}
      weight="bold"
      color="rgba(255,255,255,0.68)"
    />

    <TextInput
      placeholder="Search..."
      placeholderTextColor="rgba(255, 255, 255, 0.99)"
      value={searchText}
      onChangeText={setSearchText}
      style={styles.searchInput}
      returnKeyType="search"
      autoCorrect={false}
    />

    {searchText.length > 0 && (
      <TouchableOpacity
        activeOpacity={0.7}
        hitSlop={{
          top: 8,
          bottom: 8,
          left: 8,
          right: 8,
        }}
        onPress={() => setSearchText("")}
      >
        <Icon.X
          size={14}
          weight="bold"
          color="rgba(255,255,255,0.68)"
        />
      </TouchableOpacity>
    )}
  </View>

  <TouchableOpacity
  activeOpacity={0.8}
  onPress={() => router.push("/profileDashboard")}      ////////////////////////////////////////////
  hitSlop={{
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  }}
>
  <Icon.GearSix
    size={24}
    weight="regular"
    color="rgba(255,255,255,0.68)"
  />
</TouchableOpacity>
</View>

          <Typos
            color={colors.white}
            size={29}
            fontWeight={"800"}
            style={{ marginTop: spacingY._20, lineHeight: 34 }}
            textProps={{ numberOfLines: 2 }}
          >
            Let's Stay{"\n"}Connected  
          </Typos>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: spacingY._20 }}
            contentContainerStyle={{ gap: 14, paddingRight: 20 }}
          >
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
         
                style={styles.addAvatar}
                onPress={() =>
                  router.push({
                    pathname: "/(main)/NewUserConversationModel",
                    params: { isGroup: String(selectTab) },
                  })
                }
              >
                <Icon.Plus size={20} color="rgba(255, 255, 255, 0.99)" />
              </TouchableOpacity>
              <Typos size={12} color={"rgba(255,255,255,0.99)"} style={{ marginTop: 6 }}>
                Add
              </Typos>
            </View>

        
            {avatarRowItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={{ alignItems: "center" }}
                activeOpacity={0.7}
                onPress={() => handleAvatarPress(item)}
              >
            
                <View style={styles.storyAvatarRing}>
                  
                  <Avatar uri={item.avatar ?? null} size={58} isGroup={false} />
                </View>
                <Typos size={14} color={"rgb(255, 255, 255)"} style={{ marginTop: 6 }}>
                  {item.name?.split(" ")?.[0] ?? "—"}
                </Typos>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ===== BLACK LIST ZONE — no dividers, spacing-only separation ===== */}
        <View style={styles.content}>
          <View style={styles.tabs}>
            <TouchableOpacity
              onPress={() => setselectedTab(0)}
              style={[styles.tabStyle, selectTab == 0 && styles.activeTabStyle]}
            >
              <Typos color={selectTab == 0 ? gradientTheme.bgPureBlack : colors.white} size={15} fontWeight="600">
                Direct Messages
              </Typos>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setselectedTab(1)}
              style={[styles.tabStyle, selectTab == 1 && styles.activeTabStyle]}
            >
              <Typos color={selectTab == 1 ? gradientTheme.bgPureBlack : colors.white} size={15} fontWeight="600">
                Groups
              </Typos>
            </TouchableOpacity>
          </View>

          <ScrollView 
          showsVerticalScrollIndicator={false}
           contentContainerStyle={{
             paddingVertical: spacingY._20
              }}>
            <View style={styles.conversationList}>
              {selectTab == 0 &&
                filteredDirect.map((item: ConversationProps, index) => (
                  <MyConversationList key={index} item={item} router={router} showDivider={false} />
                ))}
              {selectTab == 1 &&
                filteredGroup.map((item: any, index) => (
                  <MyConversationList key={index} item={item} router={router} showDivider={false} />
                ))}
            </View>

            {!loading && selectTab == 0 && filteredDirect.length === 0 && (
              <Typos size={15} fontWeight="600" color={"rgba(255, 255, 255, 0.95)"} style={{ textAlign: "center", marginTop: spacingY._20 }}>
                You don't have any messages yet
              </Typos>
            )}
            {!loading && selectTab == 1 && filteredGroup.length === 0 && (
              <Typos
               size={15}
                fontWeight="600" 
                color={"rgba(255, 255, 255, 0.93)"}
                 style={{ 
                  textAlign: "center",
                   marginTop: spacingY._20
                    }}>
                No group created yet
              </Typos>
            )}
          </ScrollView>
        </View>

        <Button
          style={styles.floatingButton}
          gradientColors={[gradientTheme.ctaStart, gradientTheme.ctaMid1, gradientTheme.ctaMid2, gradientTheme.ctaEnd]}
          onPress={() =>
            router.push({
              pathname: "/(main)/NewUserConversationModel",
              params: { isGroup: String(selectTab) },
            })
          }
        >
          <Icon.Plus color={gradientTheme.bgPureBlack} size={VerticalScale(26)} weight="bold" />
        </Button>
    </LinearGradient>
    </ScreenWrapper>
   
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
     flex: 1
     },
  gradientHeader: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._5,
    paddingBottom: spacingY._20,
  },
  searchRow: {
     flexDirection: "row", 
     alignItems: "center", 
     gap: spacingX._12
     },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 46,
    borderRadius: 23,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  searchInput: {
     flex: 1, 
     color: colors.white,
      fontSize: 15
     },
  addAvatar: {
    width: 58, 
    height: 58, 
    borderRadius: 29,
    borderWidth: 2, 
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center", 
    justifyContent: "center",
  },
  // ✅ UPDATED: this now just frames whatever the shared <Avatar> component
  // renders (photo OR its own default avatar) with a themed ring border,
  // matching the reference image. Sized slightly larger than the 54px
  // Avatar so the border doesn't clip the circle.
  storyAvatarRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.57)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  content: {
    flex: 1,
    backgroundColor: gradientTheme.bgPureBlack,
    borderTopLeftRadius: radius._30,
    borderTopRightRadius: radius._30,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._20,
  },
  tabs: { flexDirection: "row", gap: spacingX._10 },
  tabStyle: {
    flex: 1,
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._20,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },
  activeTabStyle: { backgroundColor: colors.white },
  conversationList: { paddingVertical: spacingY._10 },
  floatingButton: {
    height: VerticalScale(52),
    width: VerticalScale(52),
    borderRadius: 100,
    position: "absolute",
    bottom: VerticalScale(30),
    right: VerticalScale(30),
  },
});