const jwt = require("jsonwebtoken");

const getUserIdFromToken = (token) => {
    if(!token) return null;
    const {userId} = jwt.verify(token, process.env.JWT_SECRET);
    return userId
}


module.exports = {
    getUserIdFromToken,
}