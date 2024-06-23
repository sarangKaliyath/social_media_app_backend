const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")
const UserSchema = require("../models/user.model");
const { serverError, errorResponse } = require("../utils/errorResponse.utils");
const { generateOtp, sendOtpToUserEmail } = require("../utils/otp.utils");

const userLogin = async (req, res) => {
    try {
        const {username, email, password} = req.body;

        if(!username && !email) return errorResponse(res, "Username or Email is required!");

        if(!password) return errorResponse(res, "Password is required!");

        const user = await UserSchema.findOne({
            $or: [
                {email: email}, 
                {username: username},
            ]
        }).select("+password");

        if(!user) return errorResponse(res, "User not found!");



        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword) return errorResponse(res, "Invalid Password!");

        const payload = {userId: user._id};
        const JWT_SECRET = process.env.JWT_SECRET;
        const expiresIn = '2d';

        const token = jwt.sign(payload, JWT_SECRET, {expiresIn});

        return res.status(200).json({error: false, message: "Login successful!", token});
        
    } catch (error) {
        console.log(error);
        return serverError(res);
    }
}

const generateLoginOtp = async (req, res) => {
    try {
        
        const {email, username} = req.body;

        if(!email && !username) return errorResponse(res, "Email or Username is required!");
        
        const user = await UserSchema.findOne({
            $or: [
                {username: username},
                {email: email},
            ]
        });

        if(!user) return errorResponse(res, "User Not found!", 404);

        const otp = generateOtp(6);

        const hashedOtp = await bcrypt.hash(otp, 6);
        
        user.otp = hashedOtp;
        user.otpCreatedAt = new Date();

        await user.save();

        sendOtpToUserEmail({res, user, otp});

    } catch (error) {
        console.log(error);
        return serverError(res);
    }
} 

const loginWithOtp = async (req, res) => {
    try {
        const { email, username, otp } = req.body;

        if(!otp) return errorResponse(res, "Otp is required!");
        if(!email && !username) return errorResponse(res, "Email or Username is required!");

        const user = await UserSchema.findOne({
            $or : [
                {username: username},
                {email: email}
            ]
        }).select("+otp");

        if(!user) return errorResponse(res, "User not found", 404);
        if(!user.otp) return errorResponse(res, "Please regenerate OTP!", 400, {regenerateOtp: true});

        const currentTime = new Date();
        
        const isValidOtp = await bcrypt.compare(otp, user.otp);
        
        if(!isValidOtp) return errorResponse(res, "Invalid OTP!", 401, {invalidOtp: true});

        const otpValidityDuration = 5 * 60 * 1000; 

        if(!user.otpCreatedAt || (currentTime - new Date(user.otpCreatedAt)) > otpValidityDuration) return errorResponse(res, "OTP has expired!", 401);

        user.otp = null,
        user.otpCreatedAt = null,

        await user.save();

        const payload = {userId: user._id};
        const JWT_SECRET = process.env.JWT_SECRET;
        const expiresIn = '2d';

        const token = jwt.sign(payload, JWT_SECRET, {expiresIn});

        return res.status(200).json({error: false, message: "Login successful!", token, regenerateOtp: false, invalidOtp: false});

    } catch (error) {
        console.log(error);
        return serverError(res);
    }
}

const validateToken = async (req, res) => {
    try {
        const {token} = req.body;

        if(!token) return errorResponse(res, "Token is required");

        const JWT_SECRET = process.env.JWT_SECRET;

        jwt.verify(token, JWT_SECRET, (err, decoded) => {

            if(err) return errorResponse(res, err.message, 401, {isExpired: true})
    
            return res.status(200).json({error: false, isAuthorized: true, tokenExpired: false, userId: decoded?.userId});
            
        });


    } catch (error) {
        console.log(error);
        return serverError(res);
    }
};

const resetUserPassword = async (req, res) => {
    try {
        const {email, username, newPassword, otp} = req.body;
        
        if(!newPassword) return errorResponse(res, "New Password is required!");
        if(!otp) return errorResponse(res, "Opt is required to reset password!");
        if(!email && !username) return errorResponse(res, "Email or Username is required!");
        if(newPassword.length < 6) return errorResponse(res, "Password must be at least 6 charters long!");

        const user = await UserSchema.findOne({
            $or : [
                {username: username},
                {email: email},
            ]
        }).select("+otp").select("+password");

        if(!user) return errorResponse(res, "User not found!");

        const isNewPasswordSameAsOld = await bcrypt.compare(newPassword, user.password);

        if(isNewPasswordSameAsOld) return errorResponse(res, "New Password cannot be the same as the old password");

        const currentTime = new Date();

        const otpValidityDuration = 5 * 60 * 1000; 

        if(!user.otpCreatedAt || (currentTime - new Date(user.otpCreatedAt)) > otpValidityDuration) return errorResponse(res, "OTP has expired!", 401);

        const isValidOtp = bcrypt.compare(otp, user.otp);

        if(!isValidOtp) return errorResponse(res, "Invalid Otp, please regenerate otp!", 401, {invalidOtp: true});

        user.otp = null;
        user.otpCreatedAt = null;

        const hashedPassword = await bcrypt.hash(newPassword, 6);

        user.password = hashedPassword;

        const savedUser = await user.save();

        return res.status(200).json({error: false, message: "Password reset successful", passwordReset : true});

    } catch (error) {
        console.log(error);
        return serverError(res)
    }
}

module.exports = { userLogin, generateLoginOtp, loginWithOtp, validateToken, resetUserPassword};