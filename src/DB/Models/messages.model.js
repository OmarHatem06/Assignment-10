import mongoose, { Schema } from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      minlength: [1, "content is a must"],
      maxlength: [500, "maximum is 500"],
      trim: true,
    },
    receiverid: {
      type: String,
      required: true,
      ref: "User",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
messageSchema.index({ receiverid: 1 });

export const messageModel = mongoose.model("messages", messageSchema);
