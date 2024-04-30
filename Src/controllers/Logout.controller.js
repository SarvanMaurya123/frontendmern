import User from "../models/ragister.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const LogoutUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "User is not authenticated");
    }
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { refreshToken: "" }
        },
        {
            new: true
        }
    );
    const options = {
        httpOnly: true,
    };
    res.status(200).clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, null, "User Logout Successfully"));
});

export default LogoutUser;
