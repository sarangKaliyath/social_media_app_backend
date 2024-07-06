require("dotenv").config();
const { app, server} = require("./src");
const dbConnect = require("./src/config/dbConnect");

const PORT = process.env.PORT || 8080;

dbConnect();

server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})