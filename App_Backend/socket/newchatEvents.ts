import { Server as SocketIOServer, Socket } from "socket.io";
import mongoose from "mongoose";
// import Conversation from "../models/coversationSchema.js";

import Conversation from "../utils/models/coversationSchema.js";
// import Message from "../models/Message.js";
import Message from "../utils/models/Message.js";

type ConversationType = "direct" | "group";

interface NewConversationData {
  type: ConversationType;
  participants: string[];
  name?: string;
  avatar?: string;
}

interface NewMessageData {
  conversationId: string;
  content?: string;
  attachment?: string | null;
}

const isValidObjectId = (id: unknown): id is string => {
  return (
    typeof id === "string" &&
    mongoose.Types.ObjectId.isValid(id)
  );
};

const getUniqueParticipants = (
  participants: string[]
): string[] => {
  return [...new Set(participants)];
};

export function RegisterChatEvents(
  io: SocketIOServer,
  socket: Socket
): void {
  // =========================================================
  // GET CONVERSATIONS
  // =========================================================

  socket.on("getconversation", async () => {
    try {
      const userId = socket.data.userId;

      if (!userId || !isValidObjectId(userId)) {
        socket.emit("getconversation", {
          success: false,
          msg: "Authentication Failed",
        });

        return;
      }

      const conversations = await Conversation.find({
        participants: userId,
      })
        .sort({ updatedAt: -1 })
        .populate({
          path: "lastMessage",
          select: "content senderId attachment createdAt",
        })
        .populate({
          path: "participants",
          select: "name email avatar",
        })
        .lean();

      socket.emit("getconversation", {
        success: true,
        data: conversations,
      });
    } catch (error) {
      console.error(
        "Get Conversation Error:",
        error
      );

      socket.emit("getconversation", {
        success: false,
        msg: "Failed to get conversations",
      });
    }
  });

  // =========================================================
  // CREATE / GET CONVERSATION
  // =========================================================

  socket.on(
    "newConversation",
    async (data: NewConversationData) => {
      try {
        const userId = socket.data.userId;

        if (!userId || !isValidObjectId(userId)) {
          socket.emit("newConversation", {
            success: false,
            msg: "Authentication Failed",
          });

          return;
        }

        // -----------------------------------------------------
        // Validate request
        // -----------------------------------------------------

        if (!data || !data.type) {
          socket.emit("newConversation", {
            success: false,
            msg: "Invalid conversation data",
          });

          return;
        }

        if (
          data.type !== "direct" &&
          data.type !== "group"
        ) {
          socket.emit("newConversation", {
            success: false,
            msg: "Invalid conversation type",
          });

          return;
        }

        if (!Array.isArray(data.participants)) {
          socket.emit("newConversation", {
            success: false,
            msg: "Participants must be an array",
          });

          return;
        }

        // -----------------------------------------------------
        // Remove duplicate participants
        // -----------------------------------------------------

        const participants =
          getUniqueParticipants(
            data.participants
          );

        // -----------------------------------------------------
        // Make sure current authenticated user
        // is included
        // -----------------------------------------------------

        if (!participants.includes(userId)) {
          participants.push(userId);
        }

        // -----------------------------------------------------
        // Validate participant IDs
        // -----------------------------------------------------

        const invalidParticipant =
          participants.some(
            (participantId) =>
              !isValidObjectId(participantId)
          );

        if (invalidParticipant) {
          socket.emit("newConversation", {
            success: false,
            msg: "Invalid participant ID",
          });

          return;
        }

        // =====================================================
        // DIRECT CHAT
        // =====================================================

        if (data.type === "direct") {
          if (participants.length !== 2) {
            socket.emit("newConversation", {
              success: false,
              msg: "Direct conversation must contain exactly 2 users",
            });

            return;
          }

          let conversation =
            await Conversation.findOne({
              type: "direct",
              participants: {
                $all: participants,
                $size: 2,
              },
            });

          // ---------------------------------------------------
          // Create conversation if it doesn't exist
          // ---------------------------------------------------

          if (!conversation) {
            conversation =
              await Conversation.create({
                type: "direct",
                participants,
              });
          }

          // ---------------------------------------------------
          // Populate conversation
          // ---------------------------------------------------

          const populatedConversation =
            await Conversation.findById(
              conversation._id
            )
              .populate(
                "participants",
                "name email avatar"
              )
              .populate(
                "lastMessage",
                "content senderId attachment createdAt"
              );

          // ---------------------------------------------------
          // findById can return null
          // ---------------------------------------------------

          if (!populatedConversation) {
            socket.emit("newConversation", {
              success: false,
              msg: "Failed to retrieve conversation",
            });

            return;
          }

          // ---------------------------------------------------
          // Join conversation room
          // ---------------------------------------------------

          const conversationId =
            String(populatedConversation._id);

          socket.join(conversationId);

          // ---------------------------------------------------
          // Send conversation to frontend
          // ---------------------------------------------------

          socket.emit("newConversation", {
            success: true,
            data: populatedConversation,
          });

          return;
        }

        // =====================================================
        // GROUP CHAT
        // =====================================================

        if (data.type === "group") {
          if (participants.length < 2) {
            socket.emit("newConversation", {
              success: false,
              msg: "Group conversation must contain at least 2 users",
            });

            return;
          }

          // ---------------------------------------------------
          // Create group
          // ---------------------------------------------------

          let conversation =
            await Conversation.create({
              type: "group",

              ...(data.name
                ? {
                    name: data.name.trim(),
                  }
                : {}),

              avatar: data.avatar ?? "",

              participants,
            });

          // ---------------------------------------------------
          // Populate group
          // ---------------------------------------------------

          const populatedConversation =
            await Conversation.findById(
              conversation._id
            )
              .populate(
                "participants",
                "name email avatar"
              )
              .populate(
                "lastMessage",
                "content senderId attachment createdAt"
              );

          // ---------------------------------------------------
          // findById can return null
          // ---------------------------------------------------

          if (!populatedConversation) {
            socket.emit("newConversation", {
              success: false,
              msg: "Failed to retrieve conversation",
            });

            return;
          }

          // ---------------------------------------------------
          // Join group room
          // ---------------------------------------------------

          const conversationId =
            String(populatedConversation._id);

          socket.join(conversationId);

          // ---------------------------------------------------
          // Send group to frontend
          // ---------------------------------------------------

          socket.emit("newConversation", {
            success: true,
            data: populatedConversation,
          });

          return;
        }
      } catch (error) {
        console.error(
          "New Conversation Error:",
          error
        );

        socket.emit("newConversation", {
          success: false,
          msg: "Failed to create conversation",
        });
      }
    }
  );

  // =========================================================
  // JOIN CONVERSATION
  // =========================================================

  socket.on(
    "joinConversation",
    async (conversationId: string) => {
      try {
        const userId = socket.data.userId;

        if (
          !userId ||
          !isValidObjectId(userId) ||
          !isValidObjectId(conversationId)
        ) {
          socket.emit("joinConversation", {
            success: false,
            msg: "Invalid request",
          });

          return;
        }

        // -----------------------------------------------------
        // Check conversation membership
        // -----------------------------------------------------

        const conversation =
          await Conversation.findOne({
            _id: conversationId,
            participants: userId,
          });

        if (!conversation) {
          socket.emit("joinConversation", {
            success: false,
            msg: "You are not a member of this conversation",
          });

          return;
        }

        socket.join(conversationId);

        console.log(
          `User ${userId} joined room ${conversationId}`
        );

        socket.emit("joinConversation", {
          success: true,
          conversationId,
        });
      } catch (error) {
        console.error(
          "Join Conversation Error:",
          error
        );

        socket.emit("joinConversation", {
          success: false,
          msg: "Failed to join conversation",
        });
      }
    }
  );

  // =========================================================
  // LEAVE CONVERSATION
  // =========================================================

  socket.on(
    "leaveConversation",
    async (conversationId: string) => {
      try {
        const userId = socket.data.userId;

        if (
          !userId ||
          !isValidObjectId(userId) ||
          !isValidObjectId(conversationId)
        ) {
          return;
        }

        const conversation =
          await Conversation.findOne({
            _id: conversationId,
            participants: userId,
          });

        if (!conversation) {
          return;
        }

        socket.leave(conversationId);

        console.log(
          `User ${userId} left room ${conversationId}`
        );
      } catch (error) {
        console.error(
          "Leave Conversation Error:",
          error
        );
      }
    }
  );

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  socket.on(
    "newMessage",
    async (data: NewMessageData) => {
      try {
        const userId = socket.data.userId;

        // -----------------------------------------------------
        // Authentication
        // -----------------------------------------------------

        if (
          !userId ||
          !isValidObjectId(userId)
        ) {
          socket.emit("newMessage", {
            success: false,
            msg: "Authentication Failed",
          });

          return;
        }

        // -----------------------------------------------------
        // Validate conversation ID
        // -----------------------------------------------------

        if (
          !data ||
          !isValidObjectId(data.conversationId)
        ) {
          socket.emit("newMessage", {
            success: false,
            msg: "Invalid conversation ID",
          });

          return;
        }

        // -----------------------------------------------------
        // Check conversation membership
        // -----------------------------------------------------

        const conversation =
          await Conversation.findOne({
            _id: data.conversationId,
            participants: userId,
          });

        if (!conversation) {
          socket.emit("newMessage", {
            success: false,
            msg: "You are not a member of this conversation",
          });

          return;
        }

        // -----------------------------------------------------
        // Clean message content
        // -----------------------------------------------------

        const content =
          typeof data.content === "string"
            ? data.content.trim()
            : "";

        // -----------------------------------------------------
        // Attachment
        //
        // Message model expects:
        // string | null
        // -----------------------------------------------------

        const attachment =
          typeof data.attachment === "string"
            ? data.attachment
            : null;

        // -----------------------------------------------------
        // Message cannot be empty
        // -----------------------------------------------------

        if (!content && !attachment) {
          socket.emit("newMessage", {
            success: false,
            msg: "Message cannot be empty",
          });

          return;
        }

        // -----------------------------------------------------
        // IMPORTANT:
        //
        // We DO NOT trust:
        // data.sender.id
        // data.sender.name
        // data.sender.avatar
        //
        // The authenticated socket user is the sender.
        // -----------------------------------------------------

        const message =
          await Message.create({
            conversationId:
              data.conversationId,

            senderId: userId,

            content,

            attachment,
          });

        // -----------------------------------------------------
        // Update conversation
        // -----------------------------------------------------

        await Conversation.findByIdAndUpdate(
          data.conversationId,
          {
            lastMessage: message._id,
            updatedAt: new Date(),
          }
        );

        // -----------------------------------------------------
        // Get created message with sender
        // -----------------------------------------------------

        const populatedMessage =
          await Message.findById(
            message._id
          )
            .populate(
              "senderId",
              "name avatar"
            )
            .lean();

        if (!populatedMessage) {
          socket.emit("newMessage", {
            success: false,
            msg: "Failed to retrieve created message",
          });

          return;
        }

        // -----------------------------------------------------
        // Tell TypeScript what sender looks like
        // -----------------------------------------------------

        const sender =
          populatedMessage.senderId as unknown as {
            _id: string;
            name: string;
            avatar: string;
          };

        if (!sender || !sender._id) {
          socket.emit("newMessage", {
            success: false,
            msg: "Failed to retrieve sender information",
          });

          return;
        }

        // -----------------------------------------------------
        // Response
        // -----------------------------------------------------

        const response = {
          success: true,

          data: {
            _id: populatedMessage._id,

            conversationId:
              populatedMessage.conversationId,

            sender: {
              id: sender._id,
              name: sender.name,
              avatar: sender.avatar,
            },

            content:
              populatedMessage.content,

            attachment:
              populatedMessage.attachment ?? null,

            createdAt:
              populatedMessage.createdAt,
          },
        };

        // -----------------------------------------------------
        // Send message to everyone in conversation
        // -----------------------------------------------------

        io
          .to(data.conversationId)
          .emit(
            "newMessage",
            response
          );
      } catch (error) {
        console.error(
          "New Message Error:",
          error
        );

        socket.emit("newMessage", {
          success: false,
          msg: "Failed to send message",
        });
      }
    }
  );

  // =========================================================
  // GET MESSAGES
  // =========================================================

  socket.on(
    "getMessages",
    async (data: {
      conversationId: string;
    }) => {
      try {
        const userId =
          socket.data.userId;

        // -----------------------------------------------------
        // Authentication
        // -----------------------------------------------------

        if (
          !userId ||
          !isValidObjectId(userId)
        ) {
          socket.emit("getMessages", {
            success: false,
            msg: "Authentication Failed",
          });

          return;
        }

        // -----------------------------------------------------
        // Validate conversation ID
        // -----------------------------------------------------

        if (
          !data ||
          !isValidObjectId(
            data.conversationId
          )
        ) {
          socket.emit("getMessages", {
            success: false,
            msg: "Invalid conversation ID",
          });

          return;
        }

        // -----------------------------------------------------
        // Check conversation membership
        // -----------------------------------------------------

        const conversation =
          await Conversation.findOne({
            _id: data.conversationId,
            participants: userId,
          });

        if (!conversation) {
          socket.emit("getMessages", {
            success: false,
            msg: "You are not a member of this conversation",
          });

          return;
        }

        // -----------------------------------------------------
        // Get messages
        // -----------------------------------------------------

        const messages =
          await Message.find({
            conversationId:
              data.conversationId,
          })
            .sort({
              createdAt: -1,
            })
            .populate(
              "senderId",
              "name avatar"
            )
            .lean();

        // -----------------------------------------------------
        // Format messages
        // -----------------------------------------------------

        const messagesWithSender =
          messages.map(
            (message) => {
              const sender =
                message.senderId as unknown as {
                  _id: string;
                  name: string;
                  avatar: string;
                };

              return {
                ...message,

                id: message._id,

                sender: {
                  id: sender._id,
                  name: sender.name,
                  avatar: sender.avatar,
                },
              };
            }
          );

        // -----------------------------------------------------
        // Send messages
        // -----------------------------------------------------

        socket.emit(
          "getMessages",
          {
            success: true,
            data: messagesWithSender,
          }
        );
      } catch (error) {
        console.error(
          "Get Messages Error:",
          error
        );

        socket.emit(
          "getMessages",
          {
            success: false,
            msg: "Failed to fetch messages",
          }
        );
      }
    }
  );
}