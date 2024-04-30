import User from "../models/ragister.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
const ragisterUser = asyncHandler(async (req, res) => {
    try {
        const { username, email, tel, password } = req.body;

        if ([username, email, tel, password].some((field) => typeof field !== "string" || String(field).trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }

        const alreadyExistUser = await User.findOne({ $or: [{ username }, { email }] });

        if (alreadyExistUser) {
            throw new ApiError(400, "Username or email already exists. Please try again.");
        }

        const user = await User.create({
            username: username.toLowerCase(),
            email,
            password,
            tel: String(tel)
        });

        const createUser = await User.findById(user._id).select("-password -refreshToken");

        if (!createUser) {
            throw new ApiError(500, "Something went wrong creating user");
        }

        return res.status(200).json(new ApiResponse(200, "Registration successful", true, createUser));
    } catch (error) {
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, error.message || "Internal Server Error", false));
    }
});

export { ragisterUser };
