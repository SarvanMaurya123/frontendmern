import User from "../models/ragister.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateAccessAndRefrashTokenUser from "../utils/GenerateToken.js";

const Login = asyncHandler(async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!username && !email) {
            throw new ApiError(400, "Username and email are required");
        }

        const user = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (!user) {
            throw new ApiError(404, "User does not exist");
        }

        const isPasswordCorrect = await user.isPasswordCorrect(password);

        if (!isPasswordCorrect) {
            throw new ApiError(400, "Invalid username or password");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefrashTokenUser(user._id);
        const loginedUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken, loginedUser, message: "User has been logged in successfully", success: true }));
    } catch (error) {
        return res
            .status(error.statusCode || 500)
            .json(new ApiResponse(error.statusCode || 500, error.message || "Internal Server Error", { success: false }));
    }
});

export default Login;
