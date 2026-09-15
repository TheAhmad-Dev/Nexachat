import { model, Schema } from "mongoose";
import { type ConversationProps } from "../../types.js";

const ConversationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
    },
    name: String,
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    avatar: {
      type: String,
      default: "",
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);

export default model<ConversationProps>("Conversation"  , ConversationSchema);