const mongoose = require("mongoose");

global.mongoose = {
    conn: null,
    promise: null,
}


const dbConnect = async() => {
    try {

        if(global.mongoose.conn){
            console.log("************************ Existing DB Connection ************************");
            return global.mongoose.conn;
        }
        else {
            console.log("************************ New DB Connection ************************");

            const MONGO_URI = process.env.MONGO_URI;

            const newConnPromise = await mongoose.connect(MONGO_URI, {autoIndex: true});

            global.mongoose = {
                conn: newConnPromise,
                promise: newConnPromise,
            }

            return newConnPromise;
        }

    } catch (error) {
        console.log(error);
    }
}


module.exports = dbConnect;