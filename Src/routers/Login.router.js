import Login from "../controllers/Login.controller.js";
import verifyUserJWT from "../middlerwere/auth.middlewere.js"
import { Router } from "express";
const Loginrouter = Router()

Loginrouter.route("/LoginUser").post(Login)
export default Loginrouter