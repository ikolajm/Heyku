var express = require("express");
var router = express.Router();

var User = require("../models/user.js");
var Post = require("../models/post.js");
var Comment = require("../models/comment.js");
  
    // ==========
    // Comment
    // ==========
    
        // Create a comment for a post
        router.post("/profile/:id/posts/:postid/comments", function(req, res) {
            User.findById(req.params.id, function(err, foundUser) {
               if (err) {
                   console.log(err);
                   return res.redirect("/profile/:id/posts/:postid");
               } else {
                   Post.findById(req.params.postid, function(err, foundPost) {
                      if (err) {
                          console.log(err);
                          return res.redirect("/profile/:id/posts/:postid");
                      } else {
                          Comment.create(req.body.comment, function(err, newComment) {
                              if (err) {
                                  console.log(err);
                                return res.redirect("/profile/:id/posts/:postid");
                              } else {
                                   // Add author info to new post
                                    // ID
                                    newComment.author.id = req.user._id;
                                    // Name
                                    newComment.author.name = req.user.firstName + " " + req.user.lastName;
                                    // Image
                                    newComment.author.image = req.user.image;
                                    // Likes
                                    newComment.likes = 0;
                                // Save post to db
                                newComment.save();
                                // Push post into user posts
                                foundPost.comments.push(newComment);
                                foundPost.save();
                                // Redirect
                                res.redirect("/profile/" + req.params.id +  "/posts/" + req.params.postid);
                              }
                          });
                      }
                   });
               }
            });
        });
        
        // Get edit page for a comment
        router.get("/profile/:id/posts/:postid/comment/:commentid/edit", function(req, res) {
            User.findById(req.params.id, function(err, foundUser) {
               if (err) {
                   console.log(err);
                   return res.redirect("/profile/" + req.params.id + "/posts/" + req.params.postid);
               } else {
                   Post.findById(req.params.postid, function(err, foundPost) {
                      if (err) {
                          console.log(err);
                          return res.redirect("/profile/" + req.params.id + "/posts/" + req.params.postid);
                      } else {
                          Comment.findById(req.params.commentid, function(err, foundComment) {
                              if (err) {
                                  console.log(err);
                                  return res.redirect("/profile/" + req.params.id + "/posts/" + req.params.postid);
                              } else {
                                  res.render("comments/edit", {user: foundUser, post: foundPost, comment: foundComment});
                              }
                           });
                      }
                   });
               }
            });
        });
        
        // Handle comment put request
        router.put("/profile/:id/posts/:postid/comment/:commentid", function(req, res) {
            Comment.findByIdAndUpdate(req.params.commentid, req.body.comment, function(err, modifiedComment) {
               if (err) {
                   console.log(err);
                   return res.redirect("/profile/:id/posts/:postid");
               } else {
                   res.redirect("/profile/" + req.params.id + "/posts/" + req.params.postid);
               }
            });
        });
        
        // Delete comment
        router.delete("/profile/:id/posts/:postid/comment/:commentid", function(req, res) {
            Comment.findByIdAndRemove(req.params.commentid, function(err) {
                if (err) {
                   console.log(err);
                   return res.redirect("/profile/:id/posts/:postid");
                } else {
                    res.redirect("/profile/" + req.params.id + "/posts/" + req.params.postid);
                }
            });
        });
        
// ================

module.exports = router;