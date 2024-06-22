require("dotenv").config();

module.exports = {
    swagger: {
        host: process.env.SWAGGER_HOST || 'localhost:8000'
    }
}
