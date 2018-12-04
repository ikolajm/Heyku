var express = require("express");
var router = express.Router();

var User = require("../models/user.js");
var Post = require("../models/post.js");
    
    // ==========
    // TimeLine
    // ==========

        // Render main page (facebook timeline clone)
        router.get("/timeline", function(req, res) {
            // Find user who should be logged in to access timeline
            
            // Find all posts and create timeline using Post db model
            Post.find({}, function(err, allPosts) {
                if (err) {
                    console.log(err);
                } else {
                    // Render the timeline.ejs page, render allPosts data as posts
                    res.render("posts/timeline", { posts: allPosts }); 
                }
            });
        });
        
        // Post - Have the ability to add a new post - add to timeline main page
        router.post("/timeline", function(req, res) {
            User.findById(req.user._id, function(err, foundUser) {
                if (err) {
                    console.log(err);
                    return res.redirect("/timeline");
                } else {
                    // Collect data from user model + the post form
                    Post.create(req.body.post, function(err, newPost) {
                       if (err) {
                           console.log(err);
                           return res.redirect("/timeline");
                       } else {
                            // Add author info to new post
                                // ID
                                newPost.author.id = foundUser._id;
                                // Name
                                newPost.author.name = foundUser.firstName + " " + foundUser.lastName;
                                // Image
                                newPost.author.image = foundUser.image;
                                // Likes
                                newPost.likes = 0;
                            // Save post to db
                            newPost.save();
                            // Push post into user posts
                            foundUser.posts.push(newPost);
                            foundUser.save();
                            console.log(foundUser);
                            // Redirect
                            res.redirect("/timeline");
                       }
                    });
                }
            });
        });
        
        // Render Individual Post
        router.get("/profile/:id/posts/:postid", function(req, res) {
            User.findById(req.params.id, function(err, foundUser) {
                if (err) {
                    console.log(err);
                    return res.redirect("/timeline");
                } else {
                    Post.findById(req.params.postid).populate("comments").exec(function(err, foundPost) {
                        if (err) {
                            console.log(err);
                            return res.redirect("/timeline");
                        } else {
                            res.render("posts/post", {user: foundUser, post: foundPost});
                        }
                    });
                }
            });
        });
        
        // Edit post
        router.get("/profile/:id/posts/:postid/edit", function(req, res) {
           User.findById(req.params.id, function(err, foundUser) {
                if (err) {
                    console.log(err);
                    return res.redirect("/timeline");
                } else {
                    Post.findById(req.params.postid, function(err, foundPost) {
                        if (err) {
                            console.log(err);
                            return res.redirect("/timeline/" + req.params.id + "/posts/" + req.params.postid);
                        } else {
                            // Render the edit.ejs page
                            res.render("posts/edit", {post: foundPost, user: foundUser}); 
                        }
                    });
                }
            });
        });
        
        // Update Edited Post (PUT)
        router.put("/profile/:id/posts/:postid", function(req, res) {
            Post.findByIdAndUpdate(req.params.postid, req.body.post, function(err, foundPost) {
                if (err) {
                    console.log(err);
                    return res.redirect("/timeline");
                } else {
                    // Render the single post
                    res.redirect("/profile/" + req.params.id + "/posts/" + req.params.postid);
                }
            });
        });
        
        // Delete Post (DELETE)
        router.delete("/profile/:id/posts/:postid", function(req, res) {
            Post.findByIdAndRemove(req.params.postid, function(err, foundPost) {
                if (err) {
                    console.log(err);
                    return res.redirect("/timeline");
                } else {
                    // Redirect to profile page
                    res.redirect("/profile/" + req.params.id);
                }
            });
        });
        
// ===============

module.exports = router;