const mongoose = require("mongoose");
const {Schema, model} = mongoose;


const UserSchema = new Schema({
    
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        unique: true,
        required: true,
    },

    password: {
        type: String,
        required: true,
        trim: true,
        select: false,
    },

    otp: {
        type: String,
        select: false
    },

    otpCreatedAt: {
        type: Date,
    },

    username: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },

    profilePic: {
        type: String,
    },

    gender: {
        type: String,
        enum: ['male', 'female'],
        default: "male"
    },

    newMessage: {
        type: Boolean,
        default: false,
        select: false,
    },

    unreadMessage: {
        type: Boolean,
        default: false,
        select: false,
    },

    unreadNotification: {
        type: Boolean,
        default: false,
        select: false,
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }

});

module.exports = model("UserSchema", UserSchema);