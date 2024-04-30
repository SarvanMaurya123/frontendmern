import verifyUserJWT from "../middlerwere/auth.middlewere.js"
import LogoutUser from "../controllers/Logout.controller.js";
import { Router } from "express";
const Logoutrouter = Router()

Logoutrouter.route("/LogoutUser").post(verifyUserJWT, LogoutUser)
export default Logoutrouter
