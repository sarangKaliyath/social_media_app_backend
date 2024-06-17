const errorResponse = (res, message, statusCode) => {
    return res.status(statusCode || 400).json({message, error: true});
}


module.exports = {errorResponse};