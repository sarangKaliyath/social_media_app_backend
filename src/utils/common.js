const jwt = require("jsonwebtoken");

const getUserIdFromToken = (token) => {
    let userId = undefined;
    if(token){
        userId =  jwt.verify(token, process.env.JWT_SECRET)?.userId;
    }
    return userId;
}

module.exports = {
    getUserIdFromToken,
}