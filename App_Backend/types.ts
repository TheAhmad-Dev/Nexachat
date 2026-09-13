import type { Types } from "mongoose";

export interface UserProps {
  name: string;
  password: string;
  email: string;
  avatar?: string;
  created?: Date;


  // * A user can have multiple devices, so we store
   // * multiple tokens instead of just one.
   
  pushTokens?: string[];

}

export interface ConversationProps {
  type: "direct" | "group";
  _id: Types.ObjectId;
  name?: string;
  participants: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
  createBy?: Types.ObjectId;
  avatar?: string;
  UpdatedAt?: Date;
  createdAt?: Date;
}

