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
        unique: true,
        required: true,
        trim: true,
    },

    otp: {
        type: String,
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

    newMessage: {
        type: Boolean,
        default: false,
    },

    unreadMessage: {
        type: Boolean,
        default: false,
    },

    unreadNotification: {
        type: Boolean,
        default: false,
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }

});

module.exports = model("UserSchema", UserSchema);