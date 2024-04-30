import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/ragister.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

const updateProfile = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            user.tel = parseInt(req.body.tel) || user.tel; // Parse tel as an integer

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                tel: updatedUser.tel,
            });
        } else {
            throw new ApiError('User not found', 404);
        }
    } catch (error) {
        console.error('Error in updating profile:', error);
        res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, error.message || 'Internal Server Error'));
    }
});

export { updateProfile };
