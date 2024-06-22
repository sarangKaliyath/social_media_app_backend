const express = require("express");
const app = express();
const SignupRouter = require("./routes/signup.routes");
const AuthRouter = require("./routes/auth.routes");

app.use(express.json());

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../docs/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/signup", SignupRouter);

app.use("/api/auth", AuthRouter)


module.exports = app;