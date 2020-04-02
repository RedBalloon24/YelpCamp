var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");


module.exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Login Required")
    res.redirect("/login")
}

module.exports.checkCampgroundOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground) => {
            if(err){
                req.flash("error", "Campground not found")
                res.redirect("back")
            } else {
                if(!foundCampground){
                    req.flash("error", "Item not found.")
                    return res.redirect("back")
                }
                if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                   next()
                } else {
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "Login Required!")
        res.redirect("back")
    }
}

module.exports.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err || !foundComment){
                req.flash("error", "Item not found.")
                res.redirect("back")
            } else {
                if(!foundComment){
                    req.flash("error", "Item not found.")
                    return res.redirect("back")
                }
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                   next()
                } else {
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "Login Required")
        res.redirect("back")
    }
}

module.exports.checkProfileOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        User.findById(req.params.id, (err, foundUser) => {
            if(err){
                req.flash("error", "User not found")
                res.redirect("back")
            } else {
                if(!foundUser){
                    req.flash("error", "Item not found.")
                    return res.redirect("back")
                }
                if(foundUser._id.equals(req.user._id) || req.user.isAdmin){
                   next()
                } else {
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "Login Required!")
        res.redirect("back")
    }
}