const mongoose = require("mongoose");


const dbConnect = async() => {
    try {
        const MONGO_URI = process.env.MONGO_URI;

        await mongoose.connect(MONGO_URI, {autoIndex: true});

        console.log("************************ Database connection acquired ************************")
    } catch (error) {
        console.log("************************ Database connection failed ************************");
        console.log(error);
        process.exit(1);
    }
}


module.exports = dbConnect;