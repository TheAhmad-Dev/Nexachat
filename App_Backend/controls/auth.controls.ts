import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/token.js";

type AuthRequestBody = {
  email?: unknown;
  password?: unknown;
  name?: unknown;
  avatar?: unknown;
};

const getString = (value: unknown): string => {
  return typeof value === "string" ? value.trim() : "";
};

const isDuplicateKeyError = (error: unknown): boolean => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
};

// =========================
// REGISTER
// =========================
export const registerUser = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { email, name, avatar, password } =
    request.body as AuthRequestBody;

  const normalizedEmail = getString(email).toLowerCase();
  const normalizedName = getString(name);
  const rawPassword = getString(password);
  const normalizedAvatar = getString(avatar);

  // Validate required fields
  if (!normalizedEmail || !normalizedName || !rawPassword) {
    response.status(400).json({
      success: false,
      msg: "Name, email, and password are required",
    });
    return;
  }

  // Basic password validation
  if (rawPassword.length < 6) {
    response.status(400).json({
      success: false,
      msg: "Password must be at least 6 characters",
    });
    return;
  }

  try {
    // Check whether user already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      response.status(409).json({
        success: false,
        msg: "User already exists",
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(rawPassword, 12);

    // Create user
    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      name: normalizedName,
      avatar: normalizedAvatar,
    });

    // Generate JWT
    const token = generateToken(user);

    response.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar ?? "",
      },
    });
  } catch (error) {
    // MongoDB duplicate-key protection
    if (isDuplicateKeyError(error)) {
      response.status(409).json({
        success: false,
        msg: "User already exists",
      });
      return;
    }

    console.error("Register user failed:", error);

    response.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

// =========================
// LOGIN
// =========================
export const loginUser = async (
  request: Request,
  response: Response
): Promise<void> => {
  const { email, password } =
    request.body as AuthRequestBody;

  const normalizedEmail = getString(email).toLowerCase();
  const rawPassword = getString(password);

  // Validate required fields
  if (!normalizedEmail || !rawPassword) {
    response.status(400).json({
      success: false,
      msg: "Email and password are required",
    });
    return;
  }

  try {
    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      response.status(401).json({
        success: false,
        msg: "Invalid email or password",
      });
      return;
    }

    // Compare password
    const passwordMatches = await bcrypt.compare(
      rawPassword,
      user.password
    );

    if (!passwordMatches) {
      response.status(401).json({
        success: false,
        msg: "Invalid email or password",
      });
      return;
    }

    // Generate JWT
    const token = generateToken(user);

    response.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar ?? "",
      },
    });
  } catch (error) {
    console.error("Login user failed:", error);

    response.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};