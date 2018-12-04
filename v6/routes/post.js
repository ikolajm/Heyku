var express = require("express");
var router = express.Router();

var User = require("../models/user.js");
var Post = require("../models/post.js");

var middleware = require("../middleware/middleware.js");
    
    // ==========
    // TimeLine
    // ==========

        // Render main page (facebook timeline clone)
        router.get("/timeline", middleware.isLoggedIn, function(req, res) {
            if (req.query.search) {
                const regex = new RegExp(escapeRegex(req.query.search), 'gi');
                // Find all posts and create timeline using Post db model
                Post.find({ writtenBy : regex }, function(err, allPosts) {
                        if (allPosts.length < 1) {
                            req.flash("error", "User not found");
                            return res.redirect("/timeline");
                        } else {
                            allPosts.reverse();
                            // Render the timeline.ejs page, render allPosts data as posts
                            res.render("posts/timeline", { posts: allPosts }); 
                    }
                });
            } else {
                // Find all posts and create timeline using Post db model
                Post.find({}, function(err, allPosts) {
                    if (err) {
                        console.log(err);
                        req.flash("error", err);
                        res.redirect("back");
                    } else {
                        allPosts.reverse();
                        // Render the timeline.ejs page, render allPosts data as posts
                        res.render("posts/timeline", { posts: allPosts }); 
                    }
                });
            }
        });
        
        // Keep searches safe
        function escapeRegex(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        }
        
        // Post - Have the ability to add a new post - add to timeline main page
        router.post("/timeline", middleware.isLoggedIn, function(req, res) {
            User.findById(req.user._id, function(err, foundUser) {
                if (err) {
                    console.log(err);
                    req.flash("error", err);
                    return res.redirect("/timeline");
                } else {
                    // Collect data from user model + the post form
                    Post.create(req.body.post, function(err, newPost) {
                       if (err) {
                           console.log(err);
                           req.flash("error", err);
                           return res.redirect("/timeline");
                       } else {
                            // Add author info to new post
                                // ID
                                newPost.author.id = foundUser._id;
                                // Name
                                newPost.author.name = foundUser.firstName + " " + foundUser.lastName;
                                // Image
                                newPost.author.image = foundUser.image;
                                // WrittenBy (Fuzzy search)
                                newPost.writtenBy = foundUser.firstName + " " + foundUser.lastName;
                            // Save post to db
                            newPost.save();
                            // Push post into user posts
                            foundUser.posts.push(newPost);
                            foundUser.save();
                            // Success flash
                            req.flash("success", "Post successfully added!");
                            // Redirect
                            res.redirect("/timeline");
                       }
                    });
                }
            });
        });
        
        // Render Individual Post
        router.get("/profile/:id/posts/:postid", middleware.isLoggedIn, function(req, res) {
            User.findById(req.params.id, function(err, foundUser) {
                if (err) {
                    console.log(err);
                    req.flash("error", "Post could not be found, sorry!");
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
        
        // Like a post
        router.get("/profile/:id/posts/:postid/like", middleware.isLoggedIn, function(req, res) {
            Post.findById(req.params.postid, function(err, foundPost) {
               if (err) {
                   console.log(err);
                   res.redirect("back");
               } else {
                   if (foundPost.likes.indexOf(req.user._id) >= 0) {
                       var pull = foundPost.likes.indexOf(req.user._id);
                       foundPost.likes.splice(pull, 1);
                       foundPost.save();
                       req.flash("success", "Post was unliked successfully");
                       res.redirect("back");
                   } else {
                       foundPost.likes.push(req.user._id);
                       foundPost.save();
                       req.flash("success", "Post was liked successfully");
                       res.redirect("/timeline");
                   }
               }
            });
        });
        
        // Edit post
        router.get("/profile/:id/posts/:postid/edit", middleware.checkPost, function(req, res) {
           User.findById(req.params.id, function(err, foundUser) {
                if (err) {
                    console.log(err);
                    req.flash("error", err);
                    return res.redirect("/timeline");
                } else {
                    Post.findById(req.params.postid, function(err, foundPost) {
                        if (err) {
                            console.log(err);
                            req.flash("error", err);
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
        router.put("/profile/:id/posts/:postid", middleware.checkPost, function(req, res) {
            Post.findByIdAndUpdate(req.params.postid, req.body.post, function(err, foundPost) {
                if (err) {
                    console.log(err);
                    req.flash("error", err);
                    return res.redirect("/timeline");
                } else {
                    req.flash("success", "Post successfully modified");
                    // Render the single post
                    res.redirect("/profile/" + req.params.id + "/posts/" + req.params.postid);
                }
            });
        });
        
        // Delete Post (DELETE)
        router.delete("/profile/:id/posts/:postid", middleware.checkPost, function(req, res) {
            Post.findByIdAndRemove(req.params.postid, function(err, foundPost) {
                if (err) {
                    console.log(err);
                    req.flash("error", err);
                    return res.redirect("/timeline");
                } else {
                    req.flash("success", "Post successfully deleted");
                    // Redirect to profile page
                    res.redirect("/profile/" + req.params.id);
                }
            });
        });
        
// ===============

module.exports = router;