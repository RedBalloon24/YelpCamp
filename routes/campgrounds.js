var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var secure = require("../middlewares/secure.mid")


router.get("/", secure.isLoggedIn, (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if(err){
            console.log(err)
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds})        
        }
    })
})

router.get("/new", secure.isLoggedIn, (req, res) => {
    res.render("campgrounds/new")
})

router.post("/", secure.isLoggedIn, (req, res) => {
    var name = req.body.name
    var image = req.body.image
    var description = req.body.description
    var author = {id: req.user._id, username: req.user.username}
    var newCampground = {name: name, image: image, description: description, author: author}
    
    Campground.create(newCampground, (err, newlyCreated) => {
        if(err){
            console.log(err)
        } else {
            res.redirect("/campgrounds")       
        }
    })
})

router.get("/:id", secure.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err){
            console.log(err)
        } else {
            res.render("campgrounds/show", {campground: foundCampground})
        }
    })
})

router.get("/:id/edit", secure.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", {campground: foundCampground})
    })
})

router.put("/:id", secure.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err){
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

router.delete("/:id", secure.checkCampgroundOwnership, async(req,res) => {
    try {
      let foundCampground = await Campground.findById(req.params.id);
      await foundCampground.remove();
      res.redirect("/campgrounds");
    } catch (error) {
      res.redirect("/campgrounds");
    }
})



module.exports = router;