var Campground = require("../models/campground");
var Comment = require("../models/comment");


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
                if(foundCampground.author.id.equals(req.user._id)){
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
                // if(!foundComment){
                //     req.flash("error", "Item not found.")
                //     return res.redirect("back")
                // }
                if(foundComment.author.id.equals(req.user._id)){
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