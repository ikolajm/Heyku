// Require all npm installs
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var flash = require("connect-flash");
var methodOverride = require("method-override");

// Mongoose Models
var User = require("./models/user.js");

// Moment JS
app.locals.moment = require('moment');

// Passport configuration
app.use(require("express-session")({
    secret: "this is a secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Let app use flash messages
app.use(flash());

// Check for current user on all pages, enable flash messages on all pages
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.messageError = req.flash("error");
    res.locals.messageSuccess = req.flash("success");
    next();
});

// Make app use method override
app.use(methodOverride("_method"));

// Connect mongoose to new db
mongoose.connect('mongodb://localhost:27017/heyku', { useNewUrlParser: true });

// Set view engine to seek for .ejs files
app.set("view engine", "ejs");

// Let app use bodyParser
app.use(bodyParser.urlencoded({extended: true}));

// Set public directory for style and script files
app.use(express.static(__dirname + "/public"));

// ==========
// ROUTES
// ==========

// Render the landing page
app.get("/", function(req, res) {
    res.render("landing");
});

// Routes
var authRoute = require("./routes/auth.js");
var postRoute = require("./routes/post.js");
var userRoute = require("./routes/user.js");
var commentRoute = require("./routes/comment.js");

// Use exported routes
app.use(authRoute);
app.use(postRoute);
app.use(userRoute);
app.use(commentRoute);

// Catch all route for any unused query
app.get("*", function(req, res) {
    res.redirect("/");
});

// ==========

// Listen for server to begin and notify console
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("The app has started successfully..."); 
});