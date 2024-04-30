import jwt from "jsonwebtoken";
import User from "../models/ragister.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const verifyUserJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            console.log(token)
            throw new ApiError(401, 'Unauthorized User request');
        }

        const decodeTokeninfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodeTokeninfo?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid accessToken");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid accessToken");
    }
});
export default verifyUserJWT;
