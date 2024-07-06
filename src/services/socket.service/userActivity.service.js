const jwt = require("jsonwebtoken");
const {onlineUsers} = require("./common.service");
const {getAcceptedFriendsList} = require("../../utils/socketHelpers.utils");

const userConnected = async (socket, token) => {
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET);
        
        onlineUsers.set(userId, socket.id);

        const list = await getAcceptedFriendsList(userId);
        
        setInterval( () => {
            const connectedUsersList = Array.from(onlineUsers.keys())?.filter(el => el !== userId && list.includes(el));
            socket.emit("onlineUsers", connectedUsersList);
        }, 10 * 1000);
        
    } catch (error) {
        console.log("Invalid Token", error);
        socket.emit("error", "Invalid token")
    }
};

const userDisconnected = async (socket, token) => {
    try {         
        const {userId} = jwt.verify(token, process.env.JWT_SECRET);
        onlineUsers.delete(userId);
    } catch (error) {
        console.log("Invalid Token", error);
        socket.emit("error", "Invalid Token for disconnecting");
    }
}

const disconnectBySocketId = async (socket) => {
    onlineUsers.forEach((value, key) => {
        if(value === socket.id){
            onlineUsers.delete(key);
        }
    });
};

module.exports = {
    userConnected,
    userDisconnected,
    disconnectBySocketId,
}