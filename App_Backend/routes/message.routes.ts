import { Router } from "express";
import { deleteMessage } from "../controls/message.controls.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router: Router = Router();

router.delete("/:messageId", authenticate, deleteMessage);

export default router;