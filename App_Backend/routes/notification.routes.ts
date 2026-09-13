import { Router } from "express";

import { savePushToken } from "../controls/notification.controls.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

/*
 * Save the Expo Push Token belonging to the
 * currently authenticated user.
 *
 * Authentication is required.
 */
router.post(
  "/push-token",
  authenticate,
  savePushToken
);

export default router;