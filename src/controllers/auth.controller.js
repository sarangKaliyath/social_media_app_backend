const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")
const UserSchema = require("../models/user.model");
const { serverError, errorResponse } = require("../utils/errorResponse.utils");
const { generateOtp } = require("../utils/otp.utils");

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

        let mailTransporter =
        nodemailer.createTransport(
            {
                host: 'smtp.fastmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.FAST_MAIL_EMAIL,
                    pass: process.env.FAST_MAIL_PASSWORD,
                }
            }
        );

        let mailDetails = {
            from: process.env.FAST_MAIL_EMAIL,
            to: user.email,
            subject: 'OTP FOR MAIL LOGIN',
            text: `OTP for login: ${otp}`
        };

        mailTransporter
        .sendMail(mailDetails,
            function (error, data) {
                if (error) {
                    console.log("nodemailer error: ", error);
                    return errorResponse(res, error.message);
                } else {
                    console.log('Email sent successfully');
                    return res.status(200).json({error: false, message: "Otp send to registered Email."})
                }
            }
        );

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
        if(!user.otp) return errorResponse(res, "Please regenerate OTP!");

        const currentTime = new Date();
        
        const isValidOtp = await bcrypt.compare(otp, user.otp);
        
        if(!isValidOtp) return errorResponse(res, "Invalid OTP!");

        const otpValidityDuration = 5 * 60 * 1000; 

        if(!user.otpCreatedAt || (currentTime - new Date(user.otpCreatedAt)) > otpValidityDuration) return errorResponse(res, "OTP has expired!", 401);

        user.otp = null,
        user.otpCreatedAt = null,

        await user.save();

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

module.exports = { userLogin, generateLoginOtp, loginWithOtp};