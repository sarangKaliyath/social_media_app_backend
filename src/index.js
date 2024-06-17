const express = require("express");
const app = express();
const SignupRouter = require("./routes/user.routes");


app.use(express.json());

app.use("/api/signup", SignupRouter)


module.exports = app;