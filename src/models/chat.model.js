const mongoose = require("mongoose");
const {Schema, model} = mongoose;


const ChatSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "UserSchema"
    },

    chats: [{
        messagesWith: {
            type: Schema.Types.ObjectId,
            ref: "UserSchema"
        },
        messages: [{
            text: {
                type: String,
                required: true
            },
            sender: {
                type: Schema.Types.ObjectId,
                ref: "UserSchema",
                required: true
            },
            receiver: {
                type: Schema.Types.ObjectId,
                ref: "UserSchema",
                required: true
            },
            date : {
                type: Date,
                default: Date.now
            }
        }]
    }]
})


module.exports = model("chatSchema", ChatSchema);