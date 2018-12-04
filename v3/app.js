// Require all npm installs
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var flash = require("connect-flash");

// Mongoose Models
var User = require("./models/user.js");
var Post = require("./models/post.js");
var Comment = require("./models/comment.js");

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

    // ==========
    // TimeLine
    // ==========

        // Render main page (facebook timeline clone)
        app.get("/timeline", function(req, res) {
            // Find user who should be logged in to access timeline
            
            // Find all posts and create timeline using Post db model
            Post.find({}, function(err, allPosts) {
                if (err) {
                    console.log(err);
                } else {
                    // Render the timeline.ejs page, render allPosts data as posts
                    res.render("timeline", { posts: allPosts }); 
                }
            });
        });
        
        // Post - Have the ability to add a new post - add to timeline main page
        app.post("/timeline", function(req, res) {
            // Collect data from user model + the post form
            Post.create(req.body.post, function(err, newPost) {
               if (err) {
                   console.log(err);
               } else {
                    // Add author info to new post
                        // Name
                        newPost.author.id = req.user._id;
                        // ID
                        newPost.author.id = req.user.firstName + " " + req.user.lastName;
                        // Image
                        newPost.author.image = req.user.image;
                    // Save post to db
                    newPost.save();
                    // Redirect
                    res.redirect("/timeline");
               }
            });
        });
        
        // Render Individual Post
        // app.get("/timeline/:id", function(req, res) {
        //     // Render the post.ejs page
        //   res.render("post"); 
        // });
    
    // ==========
    // Comment
    // ==========
    
    // ==========
    // User
    // ==========
        
        // Show user page
        app.get("/profile/:id", function(req, res) {
           User.findById(req.params.id, function(err, foundUser) {
               if (err) {
                   console.log(err);
                   res.redirect("/timeline");
               } else {
                   res.render("user", {user: foundUser});
               }
           });
        });
    
    // ==========
    // Auth
    // ==========
    
        // Handle login logic
        app.get("/login", function(req, res) {
            res.redirect("/");
        });
        
        // ******FIND WAY TO DEBUG LOGIN********
        // **** MISSING CREDENTIALS ****
        app.post("/login", function(req, res) {
            passport.authenticate("local",
            {
              successRedirect: "/timeline",
              failureRedirect: "/",
              failureFlash: true
            })(req, res);
        });
        
        // Handle signup logic
        app.get("/signup", function(req, res) {
            res.redirect("/");
        });
        
        app.post("/signup", function(req, res, next) {
            // Create user variable **EMAIL IS REFERRED TO AS USERNAME**
            var newUser = new User({
                                    firstName: req.body.firstName,
                                    lastName: req.body.lastName,
                                    username: req.body.username,
                                    password: req.body.password,
                                    day: req.body.day,
                                    month: req.body.month,
                                    year: req.body.year,
                                    image: req.body.image,
                                    bio: req.body.bio,
                                    city: req.body.city,
                                    state: req.body.state
                                    });
            // Log newUser
            console.log(newUser);
            User.register(newUser, req.body.password, function (err, user) {
                if (err) {
                    // Flash
                    req.flash("error", err);
                    console.log(err);
                    // Redirect to landing
                    return res.redirect('/');
                } else {
                    // go to the next middleware
                    next();
                }
            });
            // Authenticate user and redirect
            // **** MISSING CREDENTIALS ****
        }, passport.authenticate('local', { 
            successRedirect: '/timeline',
            failureRedirect: '/',
            failureFlash: true
        }));
        
        // Logout logic
        app.get("/logout", function(req, res) {
            req.logout();
            res.redirect("/");
        });

// ==========

// Listen for server to begin and notify console
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("The app has started successfully..."); 
});