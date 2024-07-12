const {AcceptedRequestSchema} = require("../models/friendship.model");
const onlineUsers = require("../services/socket.service/common.service");

const getAcceptedFriendsList = async (userId) => {
    const list = await AcceptedRequestSchema.findOne({user: userId});

    const listToSend = list?.friendsList?.map(el => el.user.toString());

    return listToSend ? listToSend : [];
}

const findConnectedUser = (userId) => {
    const user = Array.from(onlineUsers.values())?.find((val) => val.userId === userId);
    return user;
}

module.exports = {
    getAcceptedFriendsList, 
    findConnectedUser,
};