import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationOtp: {
        type: String,
    },
    verificationOtpExpires: {
        type: Date,
    },
    resetPasswordOtp: {
        type: String,
    },
    resetPasswordOtpExpires: {
        type: Date,
    },
    name: {
        type: String,
    },
    image: {
        type: String,
    },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);

export default User;
