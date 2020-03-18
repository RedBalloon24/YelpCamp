var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);
  

app.get("/", (req, res) => {
    res.render("landing")
})
app.get("/campgrounds", (req, res) => {
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err)
        } else {
            res.render("campgrounds", {campgrounds: allCampgrounds})        
        }
    })
})
app.get("/campgrounds/new", (req, res) => {
    res.render("new")
})
app.post("/campgrounds", (req, res) => {
    var name = req.body.name
    var image = req.body.image
    var description = req.body.description
    var newCampground = {name: name, image: image, description: description}

    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err)
        } else {
            res.redirect("/campgrounds")       
        }
    })
})
app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err)
        } else {
            res.render("show", {campground: foundCampground})
        }
    })
    req.params.id
})


app.listen(3000, () => console.log("YelpCamp has started"))