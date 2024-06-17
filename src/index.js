const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();

dbConnect();

app.use(express.json());


module.exports = app;