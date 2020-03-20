var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds")


mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
seedDB();


app.get("/", (req, res) => {
    res.render("landing")
})
//====================
//CAMPGROUND ROUTES
//====================
app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if(err){
            console.log(err)
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds})        
        }
    })
})
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new")
})
app.post("/campgrounds", (req, res) => {
    var name = req.body.name
    var image = req.body.image
    var description = req.body.description
    var newCampground = {name: name, image: image, description: description}

    Campground.create(newCampground, (err, newlyCreated) => {
        if(err){
            console.log(err)
        } else {
            res.redirect("/campgrounds/index")       
        }
    })
})
app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err){
            console.log(err)
        } else {
            console.log(foundCampground)
            res.render("campgrounds/show", {campground: foundCampground})
        }
    })
})
//==================
//COMMENTS ROUTES
//==================
app.get("/campgrounds/:id/comments/new", (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err)
        } else {
            res.render("comments/new", {campground: campground})
 
        }
    })
})
app.post("/campgrounds/:id/comments", (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err){
            console.log(err)
            res.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    console.log(err)
                } else {
                    campground.comments.push(comment)
                    campground.save()
                    res.redirect("/campgrounds/" + campground._id)       
                }
            })
        }
    })
})



app.listen(3000, () => console.log("YelpCamp has started"))