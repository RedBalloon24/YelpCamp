var express = require("express");
var router = express.Router();
var passport = require("passport");
var secure = require("../middlewares/secure.mid");
var User = require("../models/user");
var Campground = require("../models/campground")


router.get("/", (req, res) => {
    res.render("landing")
})

router.get("/register", (req, res) => {
    res.render("register")
})

router.post("/register", (req, res) => {
    var newUser = new User({username: req.body.username, email: req.body.email})
    
    if(req.body.adminCode === process.env.ADMINCODE || req.body.adminCode === "secretcode123"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to YelpCamp! Nice to meet you " + user.username)
            res.redirect("/campgrounds")
        })
    })
})

router.get("/login", (req, res) => {
    res.render("login")
})

router.post("/login", passport.authenticate("local", 
    {successRedirect: "/campgrounds", 
    failureRedirect: "/login"
    }), (req, res) => {
})

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logout Successful!");
    res.redirect("/")
})

router.get("/users/:id", secure.isLoggedIn, (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if(err){
            req.flash("error", "Something went wrong")
            res.redirect("/")
        }
        Campground.find().where("author.id").equals(foundUser._id).exec((err, campgrounds) => {
            if(err){
                req.flash("error", "Something went wrong")
                res.redirect("/")
            }
            res.render("users/show", {user: foundUser, campgrounds: campgrounds}) 
        })
    })
})

router.get("/users/:id/edit", secure.checkProfileOwnership, (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        res.render("users/edit", {user: foundUser}) 
    })
})

router.put("/users/:id", secure.checkProfileOwnership, (req, res) => {
        User.findByIdAndUpdate(req.params.id, req.body.user, (err, updatedUser) => {
            if(err){
                req.flash("error", err.message)
                res.redirect("/campgrounds")
            } else {
                req.flash("success", "Successfully Updated!")
                res.redirect("/users/" + req.params.id)
            }
        })
})


module.exports = router;