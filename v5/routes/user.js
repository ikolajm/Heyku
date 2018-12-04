var express = require("express");
var router = express.Router();

var User = require("../models/user.js");
var Post = require("../models/post.js");
    
    // ==========
    // User
    // ==========
        
        // Show user page
        router.get("/profile/:id", function(req, res) {
           User.findById(req.params.id, function(err, foundUser) {
               if (err) {
                   console.log(err);
                   res.redirect("/timeline");
               } else {
                //   Find all posts where the author id matches user id
                   Post.find({}).where('author.id').equals(foundUser._id).exec(function(err, foundPosts) {
                       if (err) {
                           console.log(err);
                           return res.redirect("/timeline");
                       } else {
                            res.render("users/user", {user: foundUser, post: foundPosts});
                       }
                   });
               }
           });
        });
        
        // Update user page
        router.get("/profile/:id/edit", function(req, res) {
           User.findById(req.params.id, function(err, foundUser) {
               if (err) {
                   console.log(err);
                   res.redirect("/profile/" + req.params.id);
               } else {
                   res.render("users/edit", {user: foundUser});
               }
           }); 
        });
        
        // Put update
        router.put("/profile/:id", function(req, res) {
            User.findByIdAndUpdate(req.params.id, req.body, function(err, newPost) {
                if (err) {
                    console.log(err);
                    res.redirect("/profile/" + req.params.id);
                } else {
                    res.redirect("/profile/" + req.params.id);
                }
            });
        });
        
        // Delete profile
        router.delete("/profile/:id", function(req, res) {
           User.findByIdAndRemove(req.params.id, function(err) {
              if (err) {
                  console.log(err);
                    res.redirect("/profile/" + req.params.id);
              } else {
                  res.redirect("/");
              }
           }); 
        });
        
// ===========

module.exports = router;