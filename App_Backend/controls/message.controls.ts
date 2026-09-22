import type { Response } from "express";
import mongoose from "mongoose";
// import Message from "../models/Message.js";
import Message from "../utils/models/Message.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { logger } from "../utils/logger.js";

export const deleteMessage = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const messageId = req.params.messageId;

if (Array.isArray(messageId)) {
  res.status(400).json({
    success: false,
    message: "Invalid message ID",
  });
  return;
}
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) {
      res.status(400).json({
        success: false,
        message: "Invalid message ID",
      });
      return;
    }

    const message = await Message.findById(messageId);

    if (!message) {
      res.status(404).json({
        success: false,
        message: "Message not found",
      });
      return;
    }

    if (String(message.senderId) !== String(userId)) {
      res.status(403).json({
        success: false,
        message: "You can only delete your own messages",
      });
      return;
    }

    await Message.findByIdAndDelete(messageId);

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    logger.error("Delete message error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};