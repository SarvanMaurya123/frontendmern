import { Router } from "express";
import { Forgetpassword, resetPassword, checkTokenValidity } from "../controllers/Forgetpassword.js";

const router = Router();

router.route("/forgot-password").post(Forgetpassword);
router.route("/reset-password/:token").put(resetPassword);
router.route("/reset-password/check/:token").get(checkTokenValidity);

export default router;
