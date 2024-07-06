const {AcceptedRequestSchema} = require("../models/friendship.model");


const getAcceptedFriendsList = async (userId) => {
    const list = await AcceptedRequestSchema.findOne({user: userId});

    const listToSend = list?.friendsList?.map(el => el.user.toString());

    return listToSend ? listToSend : [];
}

module.exports = {getAcceptedFriendsList};