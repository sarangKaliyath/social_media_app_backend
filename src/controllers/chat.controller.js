const ChatSchema = require("../models/chat.model");
const { serverError } = require("../utils/errorResponse.utils");


const getAllRecentChats = async (req, res) => {
    try {

        const {userId} = req;

        const user = await ChatSchema.findOne({user: userId}).populate("chats.messagesWith");

        let chatsToSend = [];

        if(user?.chats?.length > 0){

            chatsToSend = user.chats?.map(el => ({
                messagesWith: el.messagesWith._id,
                username: el.messagesWith.username,
                profilePic: el.messagesWith.profilePic,
                lastMessage: el.messages[el.messages.length - 1].text,
                date: el.messages[el.messages.length - 1].date,
            }));

        }

        return res.status(200).json({error: false, message: "Chats found", chats: chatsToSend});
        
    } catch (error) {
        console.log(error);
        return serverError(res);
    }
}


module.exports = {
    getAllRecentChats
}