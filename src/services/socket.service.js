const jwt = require("jsonwebtoken");
const {getAcceptedFriendsList}  = require("../utils/socketHelpers.utils");

const onlineUsers = new Map();

const socketConnection = (io) => {
    io.on("connection", (socket) => {

        socket.on("userConnected", async (token) => {
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

        });

        socket.on("userDisconnected", async (token) => {
            try {         
                const {userId} = jwt.verify(token, process.env.JWT_SECRET);
                onlineUsers.delete(userId);
            } catch (error) {
                console.log("Invalid Token", error);
                socket.emit("error", "Invalid Token for disconnecting");
            }
        });


        socket.on("disconnect", () => {
            let disconnectedUserId;

            onlineUsers.forEach((value, key) => {
                if(value === socket.id){
                    disconnectedUserId = key;
                    onlineUsers.delete(key);
                }
            });

        })

    })
};

module.exports = {socketConnection};