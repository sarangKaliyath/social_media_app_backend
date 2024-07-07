const mongoose = require("mongoose");
const {Schema, model} = mongoose;


const postSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: "UserSchema"
    },
    
    text: {
        type: String,
        required: true,
    },

    pictureUrl: {
        type: String
    },

    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "UserSchema"
            }
        }
    ],

    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "UserSchema"
            },

            text: {
                type: String,
                required: true
            },

            date: {
                type: Date, 
                default: Date.now
            }
        }
    ]

},
{
    timestamps: true
})


module.exports = model("postSchema", postSchema);