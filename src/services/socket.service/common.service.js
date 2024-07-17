const users = [];


const addUser = async (userId, socketId) => {
    const user = users.find((user) => user.userId === userId);

    if (user && user.socketId === socketId) {
      return users;
    } else {
      if (user && user.socketId !== socketId) {
        await removeUser(user.socketId);
      }
  
      const newUser = { userId, socketId };
  
      users.push(newUser);
  
      return users;
    }
}

const removeUser = async (socketId) => {
    const indexOf = users.map((user) => user.socketId).indexOf(socketId);
  
    await users.splice(indexOf, 1);
  
    return;
}

const findConnectedUser = (userId) =>{
    console.log("inside findConnected", {users})
   return users.find((user) => user.userId === userId);
}
module.exports = {
    addUser,
    removeUser,
    findConnectedUser
}