import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        tel: {
            type: Number,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Password hash
registerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Password verification
registerSchema.methods.isPasswordCorrect = async function (password) {
    if (!password || !this.password) {
        return false;
    }
    return bcrypt.compare(password, this.password);
};

// Access token generation
registerSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id.toString(), // Convert ObjectId to string
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// Refresh token generation
registerSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id.toString(), // Convert ObjectId to string
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

const User = mongoose.model("User", registerSchema);

export default User;
