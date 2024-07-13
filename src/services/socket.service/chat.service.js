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

const sendMessage = async (socket, token, messageWith, text) => {
    console.log({token, messageWith, text})
    try {
        const userId = getUserIdFromToken(token);

        const senderChatModel = await ChatSchema.findOne({user: userId});

        const receiverChatModel = await ChatSchema.findOne({user: messageWith});

        const newMessage = {
            text,
            sender: userId,
            receiver: messageWith,
            date :Date.now(),
        };

        const senderPreviousChat = senderChatModel.chats.find(el => el.messagesWith.toString() === messageWith);
        
        if(senderPreviousChat){
            senderPreviousChat.messages.push(newMessage);
            await senderChatModel.save();
        }
        else {
            const newChat = {
                messagesWith: messageWith,
                chats: [newMessage]
            }
            senderChatModel.chats.unshift(newChat);
            await senderChatModel.save();
        }

        const receiverPreviousChat = receiverChatModel.chats.find(el => el.messagesWith.toString() === userId);
        
        if(receiverPreviousChat){
            receiverPreviousChat.messages.push(newMessage);
            await receiverChatModel.save();
        }
        else {
            const newChat = {
                messagesWith: userId,
                chats: [newMessage]
            }
            receiverChatModel.chats.unshift(newChat);
            await receiverChatModel.save();
        }

        socket.emit("messageSent", {newMessage});

    } catch (error) {
        console.log({error})
    }
}

module.exports = {
    loadMessages,
    sendMessage,
}