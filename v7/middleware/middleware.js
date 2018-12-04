var Post = require("../models/post.js");
var Comment = require("../models/comment.js");
var User = require("../models/user.js");

var middlewareObj = {};

// Check is user is logged in
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        console.log("Not logged in... Redirecting.");
        req.flash("error", "You are not logged in");
        res.redirect("/");
    }
};

// Check to see if the user profile is owned by current user
middlewareObj.checkUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        User.findById(req.params.id, function(err, foundUser) {
           if (err) {
               console.log(err);
               req.flash("error", err);
               res.redirect("back");
           } else {
               if (foundUser._id.equals(req.user._id)) {
                   next();
               } else {
                   console.log("User not allowed to edit the profile");
                   req.flash("error", "You are not allowed to edit the profile");
                   res.redirect("back");
               }
           }
        });
    } else {
        console.log("Not logged in... Redirecting.");
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

// Check to see if post is owned by the current user
middlewareObj.checkPost = function(req, res, next) {
    if (req.isAuthenticated()) {
        Post.findById(req.params.postid, function(err, foundPost) {
           if (err) {
               console.log(err);
               req.flash("error", err);
               res.redirect("back");
           } else {
               if (foundPost.author.id.equals(req.user._id)) {
                   next();
               } else {
                   console.log("User not allowed to edit the post");
                   req.flash("error", "You do not have permission to edit that post");
                   res.redirect("back");
               }
           }
        });
    } else {
        console.log("Not logged in... Redirecting.");
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkComment = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.commentid, function(err, foundComment) {
           if (err) {
               console.log(err);
               req.flash("error", err);
               res.redirect("back");
           } else {
               if (foundComment.author.id.equals(req.user._id)) {
                   next();
               } else {
                   console.log("User not allowed to edit the comment");
                   req.flash("error", "You are not allowed to edit the comment");
                   res.redirect("back");
               }
           }
        });
    } else {
        console.log("Not logged in... Redirecting.");
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

// See if post is a valid haiku


module.exports = middlewareObj;