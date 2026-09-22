import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Conversation",
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    attachment: {
      type: String,
      default: null,
    },

    // "image" | "video" — how clients should render `attachment`.
    attachmentType: {
      type: String,
      enum: ["image", "video", null],
      default: null,
    },

    content: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;