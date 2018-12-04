var mongoose = require("mongoose");

// Define comment schema
var commentSchema = new mongoose.Schema({
   content: String,
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
    likes: []
});

// Export the model
module.exports = mongoose.model("Comment", commentSchema);