// ForgetPassword.js
import crypto from 'crypto';
import sendEmail from '../utils/SendEmail.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/ragister.model.js';
import tokens from '../utils/token.js';
import { URL } from '../utils/url.js';
// Forgot password route
const Forgetpassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        console.log("User not found");
        throw new ApiError(404, 'User not found');
    }

    const token = crypto.randomBytes(20).toString('hex');
    tokens[token] = { email: user.email, userId: user.id, createdAt: new Date() };

    const resetURL = `${URL}/confirm-password/${token}`;

    const message = `
    <h1>You have requested a password reset</h1>
    <p>Please go to this link to reset your password this link valid for 4 min:</p>
    <a href="${resetURL}">${resetURL}</a>
  `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset link',
            message
        });
        res.status(200).send('Reset password email sent');
    } catch (error) {
        throw new ApiError(500, 'Error sending reset password email');
    }
});

// Reset password route
const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const resetToken = tokens[token];
    if (!resetToken) {
        throw new ApiError(404, 'Invalid or expired token'); // Handle invalid or expired token here
    }

    // Check if the token has expired
    const tokenCreatedAt = new Date(resetToken.createdAt);
    const now = new Date();
    const timeDifference = now.getTime() - tokenCreatedAt.getTime();
    const tokenExpirationTime = process.env.REFRESH_TOKEN_EXPIRY_FORGAT || (4 * 60 * 1000); // 5 minutes by default

    if (timeDifference < 0 || timeDifference > tokenExpirationTime) {
        throw new ApiError(404, 'Invalid or expired token'); // Handle invalid or expired token here
    }

    const user = await User.findById(resetToken.userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    user.password = password;
    await user.save();

    delete tokens[token];

    res.status(200).send('Password reset successfully');
});

const checkTokenValidity = (req, res, next) => {
    const { token } = req.params;
    const resetToken = tokens[token];
    if (!resetToken) {
        return next(new ApiError(404, 'Invalid or expired token'));
    }
    const tokenCreatedAt = new Date(resetToken.createdAt);
    const now = new Date();
    const timeDifference = now.getTime() - tokenCreatedAt.getTime();
    const tokenExpirationTime = process.env.RESET_TOKEN_EXPIRY_FORGOT || (10 * 60 * 1000); // 10 minutes by default
    if (timeDifference < 0 || timeDifference > tokenExpirationTime) {
        return next(new ApiError(404, 'Invalid or expired token'));
    }
    res.status(200).send('Token is valid');
};

export { Forgetpassword, resetPassword, checkTokenValidity };
