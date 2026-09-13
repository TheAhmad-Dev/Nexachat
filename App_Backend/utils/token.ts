import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { UserProps } from "../types.js";

type TokenUser = Pick<UserProps, "email" | "name" | "avatar"> & {
  id?: string;
  _id?: unknown;
};

export const generateToken = (user: TokenUser): string => {
  const payload = {
    user: {
      email: user.email,
      name: user.name,
      id: user.id ?? String(user._id),
      avatar: user.avatar ?? "",
    },
  };

  return jwt.sign(payload, env.jwtSecret, { expiresIn: "1y" });
};
