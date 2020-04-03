var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var secure = require("../middlewares/secure.mid");


router.get("/new", secure.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err)
        } else {
            res.render("comments/new", {campground: campground})
        }
    })
})

router.post("/", secure.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err)
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    req.flash("error", "Something went wrong")
                    console.log(err)
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment)
                    campground.save()
                    console.log(comment);
                    req.flash('success', 'Created a comment!');
                    res.redirect("/campgrounds/" + campground._id)       
                }
            })
        }
    })
})

router.get("/:comment_id/edit", secure.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err || !foundCampground){
            req.flash("error", "Item not found")
            return res.redirect("back")
        }
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err){
                res.redirect("back")
            } else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})
            }
        })
    })
})

router.put("/:comment_id", secure.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err){
            res.redirect("back")
        } else {
            req.flash('success', 'Comment Updated!')
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

router.delete("/:comment_id", secure.checkCommentOwnership, (req,res) => {
    Comment.findByIdAndDelete(req.params.comment_id, (err) => {
        if(err){
            res.redirect("back")
        } else {
            req.flash("success", "Comment Deleted!")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})


module.exports = router;