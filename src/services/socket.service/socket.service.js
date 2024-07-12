const { userConnected, userDisconnected, disconnectBySocketId } = require("./userActivity.service");
const { loadMessages } = require("./chat.service");

const socketConnection = (io) => {
    io.on("connection", (socket) => {

        // user activity sockets
        socket.on("userConnected", async (token) => userConnected(socket, token));

        socket.on("userDisconnected", async (token) => userDisconnected(socket, token));

        socket.on("disconnect", () => disconnectBySocketId(socket));

        // chat sockets
        socket.on("loadMessages", async ({token, messagesWith}) => loadMessages(socket, token, messagesWith));

    })
};

module.exports = {socketConnection};