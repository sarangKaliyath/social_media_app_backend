const userSchema = require("../models/user.model");
const { serverError, errorResponse } = require("../utils/errorResponse.utils");
const { validUsernames } = require("../utils/regex.utils");
const { validateString } = require("../utils/validations.utils");



const searchUsers = async (req, res) => {
    try {
        const {username} = req.params;

        if(!username) return errorResponse(res, "Username is required!");

        if(!validateString(username, validUsernames)) return errorResponse(res, "Please enter a valid username!");
        
        const users = await userSchema.find({
            username: { $regex: username , $options: "i"},
        })

        const userDataToSend = (users || [])?.map(el => (
            {
                userId: el._id,
                username: el.username,
                profilePic: el.profilePic,
                gender: el.gender
            }
        ));

        return res.status(200).json({error: false, message: "Users Found", users: userDataToSend})
    } catch (error) {
        console.log(error);
        serverError(res);
    }
}

module.exports = {searchUsers};