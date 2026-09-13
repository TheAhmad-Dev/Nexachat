import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors, spacingX, spacingY } from "@/constants/theme";
import Avatar from "./Avatar";
import Typos from "./typos";
import moment from "moment";
import { ConversationListItemProps, ConversationProps } from "@/types";
import { useAuth } from "@/context/authcontext";
const MyConversationList = ({
  item,
  showDivider,
  router,
}: ConversationListItemProps) => {
  const { user: CurrentUser } = useAuth();

  console.log("Conversation item ", item);

  const getLastMessageContent = () => {
    // if we are new in conversation
    if (!lastMessage) return "Say Hi 👋";
    // if we have a previos conversation
    return lastMessage.attatchment ? "Image" : lastMessage.content;
  };

  const lastMessage: any = item.lastMessage;
  const isDirect = item.type == "direct";
  let avatar = item.avatar;
  const OtherParticipantOfSide = isDirect
    ? item.participants.find((p) => p._id != CurrentUser?.id)
    : null;

  if (isDirect && OtherParticipantOfSide)
    avatar = OtherParticipantOfSide?.avatar;
  // Function to get the last Date of the Message with the person

  const getLastMessageDate = () => {
    if (!lastMessage) return null;

    const messageDate = moment(lastMessage.createdAt);

    const today = moment();

    if (messageDate.isSame(today, "day")) {
      return messageDate.format("h :mm A");
    }
    if (messageDate.isSame(today, "year")) {
      return messageDate.format("MMM  D");
    }

    return messageDate.format("MMM D , Y");
  };
  const OpenNewConversation = () => {
    router.push({
      pathname: "/(main)/Chatting",
      params: {
        id: item._id,
        name: item.name,
        avatar: item.avatar,
        type: item.type,
        participants: JSON.stringify(item.participants),
      },
    });
  };
  return (
    <View>
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={OpenNewConversation}
      >
        <View>
          <Avatar
            uri={avatar ?? null}
            size={52}
            isGroup={item.type == "group"}
          />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            <Typos size={19} fontWeight={"800"}
            color={colors.white} 
            >
              {isDirect ? OtherParticipantOfSide?.name : item.name}
            </Typos>

            {item.lastMessage && (
              <Typos size={15} fontWeight={"400"}  color={colors.white} >
                {getLastMessageDate()}
              </Typos>
            )}
          </View>
          <Typos
            size={16}
            color={colors.white} 
            textProps={{ numberOfLines: 1 }}
          >
            {getLastMessageContent()}
          </Typos>
        </View>
      </TouchableOpacity>
      {showDivider && <View style={styles.divider} />}
    </View>
  );
};

export default MyConversationList;

const styles = StyleSheet.create({
  conversationItem: {
    gap: spacingX._10,
    marginVertical: spacingY._12,
    flexDirection: "row",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  divider: {
    height: 1,
    width: "95%",
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.07)",
  },
});
