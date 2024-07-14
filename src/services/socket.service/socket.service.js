const { loadMessages, sendMessage } = require("./chat.service");
const { userConnected, userDisconnected, disconnectBySocketId } = require("./userActivity.service");

const socketConnection = (io) => {
    io.on("connection", (socket) => {

        socket.on("userConnected", async (token) => userConnected(socket, token));

        socket.on("userDisconnected", async (token) => userDisconnected(socket, token));

        socket.on("disconnect", () => disconnectBySocketId(socket));

        // chats 

        socket.on("loadMessages", ({token, messagesWith}) => loadMessages(socket, token, messagesWith))

        socket.on("sendMessage", ({token,messageWith,text}) => sendMessage(io, socket, token, messageWith, text))

    })
};

module.exports = {socketConnection};