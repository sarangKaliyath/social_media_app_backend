const errorResponse = (res, message, statusCode) => {
    return res.status(statusCode || 400).json({message, error: true});
}

const serverError = (res) => {
    return res.status(500).json({error: true, message: "Internal Server Error"});
}

module.exports = {errorResponse, serverError};