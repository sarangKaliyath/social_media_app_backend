const {AcceptedRequestSchema} = require("../models/friendship.model");
const UserSchema = require("../models/user.model");

const getAcceptedFriendsList = async (userId) => {
    const list = await AcceptedRequestSchema.findOne({user: userId});

    const listToSend = list?.friendsList?.map(el => el.user.toString());

    return listToSend ? listToSend : [];
}

const setMessageToUnRead = async (userId) => {
    try {
        const user = await UserSchema.findById(userId).select("+unreadMessage"); 
        if(!user.unreadMessage){
            user.unreadMessage = true;
            await user.save();
        }
            
        return;
    } catch (error) {
        console.log("inside setMessage to unread", error);
    }
}

module.exports = {
    getAcceptedFriendsList,
    setMessageToUnRead,
};