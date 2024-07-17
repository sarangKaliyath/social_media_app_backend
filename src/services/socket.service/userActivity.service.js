const jwt = require("jsonwebtoken");
const {addUser, removeUser} = require("./common.service");
const {getAcceptedFriendsList} = require("../../utils/socketHelpers.utils");

const userConnected = async (socket, token) => {
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET);
        
        const users = await addUser(userId, socket.id);

        const list = await getAcceptedFriendsList(userId);
        
        setInterval( () => {
            const connectedUsersList = users.filter(el => el.userId !== userId);
            socket.emit("onlineUsers", connectedUsersList);
        }, 10 * 1000);
        
    } catch (error) {
        console.log("Invalid Token", error);
        socket.emit("error", "Invalid token")
    }
};

const userDisconnected = async (socket) => {
    try {  
        removeUser(socket.id);
    } catch (error) {
        console.log("Invalid Token", error);
        socket.emit("error", "Invalid Token for disconnecting");
    }
}


module.exports = {
    userConnected,
    userDisconnected,
}