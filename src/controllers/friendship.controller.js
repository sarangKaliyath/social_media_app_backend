const { serverError, errorResponse } = require("../utils/errorResponse.utils");
const { PendingRequestSchema, AcceptedRequestSchema } = require("../models/friendship.model");

const sendFriendsRequest = async (req, res) => {
    try {
        const {userId} = req;
        const { friendToAddId } = req.params;

        const user = await PendingRequestSchema.findOne({user: userId});
        const userToAdd = await PendingRequestSchema.findOne({user: friendToAddId});

        if(!user || !userToAdd) return errorResponse(res, "User not found");

        const isRequestAlreadySend = user.requested.length > 0 && 
            user.requested?.filter((el) => el.user.toString() === userToAdd);
  
        if(isRequestAlreadySend) return errorResponse(res, "Request already sent", 400, {alreadyRequested: true});
            
        const isRequestAlreadyReceived = user.received.length > 0 && 
            user.received?.filter((el) => el.user.toString() === userToAdd);
            
        if(isRequestAlreadyReceived) return errorResponse(res, "Request already received", 400, {requestReceived: true});

        user.requested.unshift({user : friendToAddId});
        await user.save();

        userToAdd.received.unshift({user: userId});
        await userToAdd.save();

        return res.status(200).json({error: false, message: "Request sent successfully"})
    } catch (error) {
        console.log(error);
        return serverError(res);
    }
}

const acceptFriendsRequest = async (req, res) => {
    try {
        const {userId} = req;
        const {userIdToAdd} = req.params;

        // this is the user who received and will accept the friends request;
        const currentUser = await PendingRequestSchema.findOne({user: userId});

        // this is the user who sent the friends request;
        const userToAdd = await PendingRequestSchema.findOne({user: userIdToAdd});

        if(!currentUser || !userToAdd) return errorResponse(res, "User not Found!");

        if(currentUser.received.length === 0) return errorResponse(res, "No request received!");

        currentUser.received = currentUser.received.filter((el) => el.user?.toString() !== userIdToAdd);
        await currentUser.save();

        userToAdd.requested = userToAdd.requested.filter((el) => el.user?.toString() !== userId);
        await userToAdd.save();

        // updating accepted request DB for both users and adding both to each others friends list;
        const currentUserAcceptedList = await AcceptedRequestSchema.findOne({user: userIdToAdd});
        currentUserAcceptedList.friendsList.unshift({user: userId});
        currentUserAcceptedList.save();

        const userToAddAcceptedList = await AcceptedRequestSchema.findOne({user: userId});
        userToAddAcceptedList.friendsList.unshift({user: userIdToAdd});
        userToAddAcceptedList.save();


        return res.status(200).json({error: false, message: "Request accepted!"});
    } catch (error) {
        console.log(error);
        return serverError(res);
    }
}

const getPendingRequestList = async (req, res) => {
    try {
        const {userId} = req;

        const user = await PendingRequestSchema.findOne({user: userId})
        .populate('requested.user')
        .populate('received.user');

        if(!user) return errorResponse(res, "User not found");

        return res.status(200).json({error: false, message: "Pending list retrieved!", 
            friendsRequestSent: user.requested, 
            friendsRequestReceived: user.received
        })
        
    } catch (error) {
        console.log(error);
        return serverError(res);
    }
};

const getFriendsList = async (req, res) => {
    try {

        const {userId} = req;

        const friendsList = await AcceptedRequestSchema.findOne({user: userId}).populate("friendsList.user");

        res.status(200).json({error: false, message: "List acquired!", friendsList : friendsList || []});
       
    } catch (error) {
        console.log(error);
        return serverError(res);
    }
}



module.exports = {
    sendFriendsRequest,
    acceptFriendsRequest,
    getPendingRequestList,
    getFriendsList,
}