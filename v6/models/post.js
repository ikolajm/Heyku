var mongoose = require("mongoose");

// Post Schema
var postSchema = new mongoose.Schema({
   line1: String,
   line2: String,
   line3: String,
   author: {
                id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User"
                    },
                name: String,
                image: String
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
    writtenBy: String,
    likes: []
});

// Export model
module.exports = mongoose.model("Post", postSchema);