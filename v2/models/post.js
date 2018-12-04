var mongoose = require("mongoose");

// Post Schema
var postSchema = new mongoose.Schema({
   content: String,
   author: {
                id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User"
                    },
                name: String,
            },
    createdAt: {
                    type: Date,
                    default: Date.now 
                },
    comments: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Comment"
                }
            ],
    likes: Number
});

// Export model
module.exports = mongoose.model("Post", postSchema);