require("dotenv").config();
const app = require("./src");
const dbConnect = require("./src/config/dbConnect");

const PORT = process.env.PORT || 8080;

dbConnect();

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})