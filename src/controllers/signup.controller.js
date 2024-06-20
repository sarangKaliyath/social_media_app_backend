const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserSchema = require("../models/user.model");
const { errorResponse, serverError } = require("../utils/errorResponse.utils");
const profilePicFemale = 'https://res.cloudinary.com/dnc3g9s6f/image/upload/v1718890934/l5nw5p87uie3xyr60hcf.jpg';
const profilePicMale = 'https://res.cloudinary.com/dnc3g9s6f/image/upload/v1718890814/zjvfntcm4ek9n1adub9w.webp';

const registerNewUser = async (req, res) => {
    try {
        const {name, email, password, username, profilePic, gender} = req.body;

        if(!name) return errorResponse(res, "Name is required!");
        if(!email) return errorResponse(res, "Email is required!");

        if(password?.length < 6) return errorResponse( res, "Password must be at least 6 characters long!");

        let user = await UserSchema.findOne({email});

        if(user)return errorResponse(res, "Email already registered!");

        user = await UserSchema.findOne({username});

        if(user) return errorResponse(res, "Username already taken!");

        const hashedPassword = await bcrypt.hash(password, 6);

        const picUrlToSave = gender === "female" ? profilePicFemale : profilePicMale;

        user = new UserSchema({
            name,
            email,
            password: hashedPassword,
            username: username,
            profilePic: profilePic || picUrlToSave, 
        })

        await user.save();
        
        const payload = {userId: user._id};
        const JWT_SECRET = process.env.JWT_SECRET;
        const expiresIn = '2d';

        const token = jwt.sign(payload, JWT_SECRET, {expiresIn},);

        return res.status(201).json({error: false, message: "User Registered Successfully!", token});
    } catch (error) {
        console.log(error);
        return serverError(res);
    }
};

const isUsernameRegistered = async(req, res) => {
    try {

        const {username} = req.params;

        const user = await UserSchema.findOne({username});

        if(user) return errorResponse(res, "Username already taken!");

        return res.status(200).json({error: false, message: "Username available"});
        
    } catch (error) {
        console.log(error);
        return serverError(res);
    }
}

module.exports = {registerNewUser, isUsernameRegistered};