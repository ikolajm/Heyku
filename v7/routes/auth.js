var express = require("express");
var router = express.Router();
var passport = require("passport");

var User = require("../models/user.js");

    // ==========
    // Auth
    // ==========
    
        // Handle login logic
        router.get("/login", function(req, res) {
            res.redirect("/");
        });
    
        router.post("/login", function(req, res) {
            passport.authenticate("local",
            {
              successRedirect: "/timeline",
              failureRedirect: "/",
              failureFlash: true
            })(req, res);
        });
        
        // Handle signup logic
        router.get("/signup", function(req, res) {
            res.redirect("/");
        });
        
        router.post("/signup", function(req, res, next) {
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
        }, passport.authenticate('local', { 
            successRedirect: '/timeline',
            failureRedirect: '/',
            failureFlash: true
        }));
        
        // Logout logic
        router.get("/logout", function(req, res) {
            req.logout();
            req.flash("success", "Successfully logged you out!");
            res.redirect("/");
        });

// ==========

module.exports = router;