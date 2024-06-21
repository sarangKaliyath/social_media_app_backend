const express = require("express");
const cors = require('cors');


const app = express();
const SignupRouter = require("./routes/signup.routes");
const AuthRouter = require("./routes/auth.routes");

app.use(cors());
app.use(express.json());

app.use("/api/signup", SignupRouter);

app.use("/api/auth", AuthRouter)


module.exports = app;