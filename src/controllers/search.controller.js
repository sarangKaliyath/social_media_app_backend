const { AcceptedRequestSchema } = require("../models/friendship.model");
const userSchema = require("../models/user.model");
const { serverError, errorResponse } = require("../utils/errorResponse.utils");
const { validUsernames } = require("../utils/regex.utils");
const { validateString } = require("../utils/validations.utils");



const searchUsers = async (req, res) => {
    try {
        const {username} = req.params;
        const {userId} = req;

        if(!username) return errorResponse(res, "Username is required!");

        if(!validateString(username, validUsernames)) return errorResponse(res, "Please enter a valid username!");
        
        const users = await userSchema.find({
            username: { $regex: username , $options: "i"},
        })

        const userDataToSend = (users?.length > 0 && 
            users.
            filter(el => el._id?.toString() !== userId )?.
            map(el => (
                {
                    userId: el._id,
                    username: el.username,
                    profilePic: el.profilePic,
                    gender: el.gender
                }
            
            ))
        ) || [];

        return res.status(200).json({error: false, message: "Users Found", users: userDataToSend})
    } catch (error) {
        console.log(error);
        serverError(res);
    }
}

const searchFriends = async (req, res) => {
    try {

        const {userId} = req;
        const {username} = req.params;

        if(!username) return errorResponse(res, "Username is required!");

        const list = await AcceptedRequestSchema.findOne({user: userId}).populate("friendsList.user");

        if(!list) return errorResponse(res, "Friends list not found");

        const regEx = new RegExp(username, "i");

        const matchingFriends = list.friendsList.filter((el) => regEx.test(el.user.username))
            .map(el => ({
                id: el.user._id,
                email: el.user.email,
                username: el.user.username,
                profilePic: el.user.profilePic,
            }))

        return res.status(200).json({error: false, message: "Friends List", searchList: matchingFriends || []});
        
    } catch (error) {
        console.log(error);
        return serverError(res);
    }
}

module.exports = {searchUsers, searchFriends};