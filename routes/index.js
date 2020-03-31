var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user")


router.get("/", (req, res) => {
    res.render("landing")
})

router.get("/register", (req, res) => {
    res.render("register")
})

router.post("/register", (req, res) => {
    var newUser = new User({username: req.body.username})
    
    if(req.body.adminCode === "secretcode123"){
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


module.exports = router;