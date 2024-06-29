const mongoose = require('mongoose');
const {Schema, model} = mongoose;


const PendingRequestSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "UserSchema",
    },  
    requested: [
        {   
            user: {
                type: Schema.Types.ObjectId,
                ref: "UserSchema",
            }
        }
    ],
    received: [
        {
            user: { 
                type: Schema.Types.ObjectId,
                ref: "UserSchema",
            }
        }
    ]
});


const AcceptedRequestSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "UserSchema",
    },  

    friendsList: [
        {
            user: { 
                type: Schema.Types.ObjectId,
                ref: "UserSchema",
            }
        }
    ]
});

const RejectedRequestSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "UserSchema",
    },  
    requested: [
        {   
            user: {
                type: Schema.Types.ObjectId,
                ref: "UserSchema",
            }
        }
    ],
    received: [
        {
            user: { 
                type: Schema.Types.ObjectId,
                ref: "UserSchema",
            }
        }
    ]
});


module.exports = {
    PendingRequestSchema: model("PendingRequestSchema", PendingRequestSchema),
    AcceptedRequestSchema: model("AcceptedRequestSchema", AcceptedRequestSchema),
    RejectedRequestSchema: model("RejectedRequestSchema", RejectedRequestSchema),
}

