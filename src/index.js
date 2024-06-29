const express = require("express");
const cors = require('cors');


const app = express();
const SignupRouter = require("./routes/signup.routes");
const AuthRouter = require("./routes/auth.routes");
const SearchRouter = require("./routes/search.routes");
const FriendshipRouter = require("./routes/friendship.route");

app.use(cors());
app.use(express.json());

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/signup", SignupRouter);

app.use("/api/auth", AuthRouter);

app.use("/api/search", SearchRouter);

app.use("/api/request", FriendshipRouter);


module.exports = app;