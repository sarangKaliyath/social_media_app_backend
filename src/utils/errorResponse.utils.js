const errorResponse = (res, message, statusCode, keys = {}) => {
    return res.status(statusCode || 400).json({message, error: true, ...keys});
}

const serverError = (res) => {
    return res.status(500).json({error: true, message: "Internal Server Error"});
}

module.exports = {errorResponse, serverError};