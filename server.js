require("dotenv").config();
const app = require("./src");
const dbConnect = require("./src/config/dbConnect");

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 8080;

dbConnect();

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})