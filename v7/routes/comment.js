var express = require("express");
var router = express.Router();

var User = require("../models/user.js");
var Post = require("../models/post.js");
var Comment = require("../models/comment.js");

var middleware = require("../middleware/middleware.js");
  
    // ==========
    // Comment
    // ==========
    
        // Create a comment for a post
        router.post("/profile/:id/posts/:postid/comments", middleware.isLoggedIn, function(req, res) {
            User.findById(req.params.id, function(err, foundUser) {
               if (err) {
                   console.log(err);
                   req.flash("error", err);
                   return res.redirect("/profile/:id/posts/:postid");
               } else {
                   Post.findById(req.params.postid, function(err, foundPost) {
                      if (err) {
                          console.log(err);
                          req.flash("error", err);
                          return res.redirect("/profile/:id/posts/:postid");
                      } else {
                          Comment.create(req.body.comment, function(err, newComment) {
                              if (err) {
                                  console.log(err);
                                  req.flash("error", err);
                                return res.redirect("/profile/:id/posts/:postid");
                              } else {
                                   // Add author info to new post
                                    // ID
                                    newComment.author.id = req.user._id;
                                    // Name
                                    newComment.author.name = req.user.firstName + " " + req.user.lastName;
                                    // Image
                                    newComment.author.image = req.user.image;
                                // Save post to db
                                newComment.save();
                                // Push post into user posts
                                foundPost.comments.push(newComment);
                                foundPost.save();
                                req.flash("success", "Comment successfully added");
                                // Redirect
                                res.redirect("/profile/" + req.params.id +  "/posts/" + req.params.postid);
                              }
                          });
                      }
                   });
               }
            });
        });
        
        // Like a comment 
        router.get("/profile/:id/posts/:postid/comments/:commentid/like", middleware.isLoggedIn, function(req, res) {
            Post.findById(req.params.postid, function(err, foundPost) {
               if (err) {
                   console.log(err);
                   res.redirect("back");
               } else {
                   Comment.findById(req.params.commentid, function(err, foundComment) {
                       if (err) {
                           console.log(err);
                           req.flash("error", err);
                           res.redirect("back");
                       } else {
                           if (foundComment.likes.indexOf(req.user._id) >= 0) {
                               var pull = foundComment.likes.indexOf(req.user._id);
                               foundComment.likes.splice(pull, 1);
                               foundComment.save();
                               req.flash("success", "Comment was successfully unliked");
                               res.redirect("back");
                           } else {
                               foundComment.likes.push(req.user._id);
                               foundComment.save();
                               req.flash("success", "Comment was successfully liked");
                               res.redirect("/profile/" + req.params.id + "/posts/" + req.params.postid);
                           }
                       }
                   });
               }
            });
        });
        
        // Get edit page for a comment
        router.get("/profile/:id/posts/:postid/comment/:commentid/edit", middleware.checkComment, function(req, res) {
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
        router.put("/profile/:id/posts/:postid/comment/:commentid", middleware.checkComment, function(req, res) {
            Comment.findByIdAndUpdate(req.params.commentid, req.body.comment, function(err, modifiedComment) {
               if (err) {
                   console.log(err);
                   req.flash("error", err);
                   return res.redirect("/profile/:id/posts/:postid");
               } else {
                   req.flash("success", "Comment was modified successfully");
                   res.redirect("/profile/" + req.params.id + "/posts/" + req.params.postid);
               }
            });
        });
        
        // Delete comment
        router.delete("/profile/:id/posts/:postid/comment/:commentid", middleware.checkComment, function(req, res) {
            Comment.findByIdAndRemove(req.params.commentid, function(err) {
                if (err) {
                   console.log(err);
                   req.flash("error", err);
                   return res.redirect("/profile/:id/posts/:postid");
                } else {
                    req.flash("success", "Comment successfully deleted");
                    res.redirect("/profile/" + req.params.id + "/posts/" + req.params.postid);
                }
            });
        });
        
// ================

module.exports = router;