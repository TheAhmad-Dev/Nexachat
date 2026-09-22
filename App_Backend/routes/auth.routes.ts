import { Router } from "express";

import { loginUser, registerUser } from "../controls/auth.controls.js";
import { refreshAccessToken } from "../controls/refresh.controls.js";
import { googleAuth } from "../controls/google.controls.js";

const router: Router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/google", googleAuth);

export default router;
