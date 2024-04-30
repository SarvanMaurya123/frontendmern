import { Router } from "express";
import { ragisterUser } from "../controllers/ragister.controller.js";
const router = Router()
router.route("/RagisterUser").post(ragisterUser)
export default router