const generateOtp = (len) => {

    const otpLength = len || 5;
    let otp = "";
    let char = "0123456789";

    for(let i = 0; i < otpLength; i++){
        otp+= char[Math.floor(Math.random() * 10)];
    }

    return otp;
}


module.exports = {generateOtp};