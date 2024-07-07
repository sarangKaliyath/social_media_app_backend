const express = require("express");
const cors = require('cors');
const { Server } = require("socket.io");
const http = require("http");
const { socketConnection }  = require("./services/socket.service/socket.service");

const SignupRouter = require("./routes/signup.routes");
const AuthRouter = require("./routes/auth.routes");
const SearchRouter = require("./routes/search.routes");
const FriendshipRouter = require("./routes/friendship.route");
const PostRouter = require("./routes/post.routes");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

socketConnection(io);

app.use(cors());
app.use(express.json());

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/signup", SignupRouter);

app.use("/api/auth", AuthRouter);

app.use("/api/search", SearchRouter);

app.use("/api/request", FriendshipRouter);

app.use("/api/post", PostRouter);

module.exports = {app, server};