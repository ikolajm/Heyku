var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// User schema
var userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    // **EMAIL IS REFERRED TO AS USERNAME**
    username: String,
    password: String,
    day: String,
    month: String,
    year: String,
    bio: String,
    image: String,
    city: String,
    state: String,
    joinedOn: {
                    type: Date,
                    default: Date.now
                },
    posts: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Post"
                }
            ]
});

userSchema.plugin(passportLocalMongoose);

// Export the model
module.exports = mongoose.model("User", userSchema);