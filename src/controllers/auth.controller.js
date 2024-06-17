const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserSchema = require("../models/user.model");
const { serverError, errorResponse } = require("../utils/errorResponse");


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

module.exports = {userLogin};