import mongoose, { type Model } from "mongoose";
import type { UserProps } from "../../types.js";

const { Schema, model, models } = mongoose;

const UserSchema = new Schema<UserProps>({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  created: {
    type: Date,
    default: Date.now,
  },
  pushTokens: {
  type: [String],
  default: [],
},
});

const User =
  (models.User as Model<UserProps> | undefined) ??
  model<UserProps>("User", UserSchema);

export default User;
