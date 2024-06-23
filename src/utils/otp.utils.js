const nodemailer = require("nodemailer");
const {errorResponse, serverError} = require("../utils/errorResponse.utils");

const generateOtp = (len) => {

    const otpLength = len || 5;
    let otp = "";
    let char = "0123456789";

    for(let i = 0; i < otpLength; i++){
        otp+= char[Math.floor(Math.random() * 10)];
    }

    return otp;
}

const sendOtpToUserEmail = ({res, user, otp}) => {
    try {
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
                    return errorResponse(res, error.message, {otpSent: false});
                } else {
                    console.log('Email sent successfully');
                    return res.status(200).json({error: false, message: "Otp send to registered Email.", otpSent: true, userEmail: user.email});
                }
            }
        );
    } catch (error) {
        console.log(error);
        return serverError(res);
    }
}

module.exports = {generateOtp, sendOtpToUserEmail};