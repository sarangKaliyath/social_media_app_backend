const { serverError, errorResponse } = require("../utils/errorResponse.utils");
const { PendingRequestSchema } = require("../models/friendship.model");

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
            
        if(isRequestAlreadyReceived) return errorResponse(res, "Request already received", {requestReceived: true});

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



module.exports = {
    sendFriendsRequest,
}