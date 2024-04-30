import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userrouter from "./routers/Ragister.routers.js";
import Loginrouter from "./routers/Login.router.js";
import Logoutrouter from "./routers/Logout.router.js";
import ForgetresetPassword from './routers/Forget.js'
import CheangeProfileUser from './routers/UserProfile.router.js'

app.use("/api/v1/user", userrouter);
app.use("/api/v1/login", Loginrouter);
app.use("/api/v1/logout", Logoutrouter);
app.use("/api/v1", ForgetresetPassword);
app.use("/api/v1", CheangeProfileUser);


export default app;
