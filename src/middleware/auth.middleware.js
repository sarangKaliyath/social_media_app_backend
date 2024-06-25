const jwt = require("jsonwebtoken");
const { isExpired } = require("../utils/validations.utils");

const authMiddleWare = async (req, res, next) => {
    try {

        const { authorization } = req.headers;

        if(!authorization) return res.status(402).json({error: true, message: "Token is Required!", unauthorized: true});

        const {userId, exp} = jwt.verify(authorization, process.env.JWT_SECRET);
        
        if(isExpired(exp)) return res.status(402).json({error: true, message: "Session expired", unauthorized: true});
        
        req.userId = userId;

        next();
    } catch (error) {
        console.log(error);
        return res.status(402).json({error: true, message: "Unauthorized", unauthorized: true});
    }
} 

module.exports = authMiddleWare;