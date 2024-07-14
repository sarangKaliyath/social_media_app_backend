const onlineUsers = new Map();

const getSocketId = (userId) => {
   for(let [key, value] of onlineUsers.entries()){
    if(key === userId){
        return {userId: key, socketId: value}
    }
   }
   return null;
}

module.exports = {
    onlineUsers,
    getSocketId
}