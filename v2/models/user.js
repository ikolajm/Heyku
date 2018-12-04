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
    image: String
});

userSchema.plugin(passportLocalMongoose);

// Export the model
module.exports = mongoose.model("User", userSchema);