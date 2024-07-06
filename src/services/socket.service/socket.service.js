const { userConnected, userDisconnected, disconnectBySocketId } = require("./userActivity.service");

const socketConnection = (io) => {
    io.on("connection", (socket) => {

        socket.on("userConnected", async (token) => userConnected(socket, token));

        socket.on("userDisconnected", async (token) => userDisconnected(socket, token));

        socket.on("disconnect", () => disconnectBySocketId(socket));

    })
};

module.exports = {socketConnection};