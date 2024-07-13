const ChatSchema = require("../../models/chat.model");
const { getUserIdFromToken } = require("../../utils/common");

const loadMessages = async (socket, token, messagesWith) => {
    try {
        const userId = getUserIdFromToken(token);

        const user = await ChatSchema.findOne({user: userId}).populate("chats.messagesWith");

        const chats = user.chats.find(el => el?.messagesWith?._id?.toString() === messagesWith);
        
        if(!chats){
            socket.emit("noChatFound", {error: true, message: "No Chat Found!"});
        }
        else {
            socket.emit("messagesLoaded", {error: false, message: "Chats Loaded", chats: chats});
        }
        
    } catch (error) {
        
    }
}

module.exports = {
    loadMessages
}