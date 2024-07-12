const jwt = require('jsonwebtoken');
const ChatSchema = require("../../models/chat.model");
const { getUserIdFromToken } = require('../../utils/common.utils');
const { findConnectedUser } = require('../../utils/socketHelpers.utils');

const loadMessages = async (socket, token, messagesWith) => {
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET);
        
        const userChatModel = await ChatSchema.findOne({user: userId})
            .populate("chats.messagesWith")
        
        const userChats = userChatModel.chats.find((el) => el.messagesWith.toString() === messagesWith);

        if(!userChats) socket.emit("noMessagesFound");

        else socket.emit("messagesFound", userChats );

    } catch (error) {
        console.log(error);
        socket.emit("noMessagesFound");
    }
}

const sendMessage = async (io, socket, token, messagesWith, message) => {
    try {
        const userId = getUserIdFromToken(token);

        const senderChat = await ChatSchema.findOne({user: userId});

        const receiverChat = await ChatSchema.findOne({user: messagesWith});

        const newMessage = {
            text: message,
            sender: userId,
            receiver: messagesWith,
        }

        const senderPrevMessages = senderChat.chats?.find((msg) => msg.messagesWith.toString() === messagesWith);

        if(senderPrevMessages){
            senderPrevMessages.messages.push(newMessage);
            await senderChat.save()
        }
        else {
            const firstMessage = {
                messagesWith: messagesWith,
                messages: [newMessage]
            }
            senderChat.chats.unshift(firstMessage);
            await senderChat.save();
        }

        const receiverPrevMessages = receiverChat.chats?.find((msg) => msg.messagesWith.toString() === userId);

        if(receiverPrevMessages){
            receiverPrevMessages.messages.push(newMessage);
            await receiverChat.save();
        }
        else {
            const firstMessage = {
                messagesWith: userId,
                messages: [newMessage]
            }
            receiverChat.chats.unshift(firstMessage);
            await receiverChat.save();
        }

        io.to(socket.id).emit('newMessageReceived', {newMessage});

    } catch (error) {
        console.log(error)

    }

}

module.exports = {
    loadMessages,
    sendMessage,
}